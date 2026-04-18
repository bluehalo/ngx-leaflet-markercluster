import { Component, NgZone, OnInit } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { LeafletMarkerClusterDirective } from '../../../projects/ngx-leaflet-markercluster/src/public-api';

interface LogEntry {
	message: string;
	type: 'info' | 'success' | 'warning';
}

const TRIAL_COUNT = 10;

// Must be > 300ms to let leaflet.markercluster's _enqueue setTimeout settle.
const RESET_SETTLE_MS = 500;

// Per-trial callback timeout. Zoom animation + animationend typically < 1s.
const TRIAL_TIMEOUT_MS = 3000;

@Component({
	selector: 'zoom-to-show-demo',
	templateUrl: './zoom-to-show-demo.component.html',
	imports: [
		LeafletModule,
		LeafletMarkerClusterDirective,
	]
})
export class ZoomToShowDemoComponent implements OnInit {

	private readonly INITIAL_ZOOM = 2;
	private readonly INITIAL_CENTER = L.latLng([0, 0]);
	private readonly TARGET_LATLNG = L.latLng(40.7128, -74.0060); // NYC

	LAYER_OSM = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 18,
		noWrap: true,
		attribution: 'Open Street Map'
	});

	options: L.MapOptions = {
		layers: [this.LAYER_OSM],
		zoom: this.INITIAL_ZOOM,
		center: this.INITIAL_CENTER
	};

	markerClusterGroup: L.MarkerClusterGroup;
	markerClusterData: L.Marker[] = [];
	targetMarker: L.Marker;
	map: L.Map;

	readonly trialCount = TRIAL_COUNT;

	/** Which button is currently running trials, or null if idle. */
	runningMode: 'broken' | 'fixed' | null = null;
	log: LogEntry[] = [];

	private cancelTrials = false;

	constructor(private zone: NgZone) {}

	ngOnInit() {
		this.buildMarkers();
	}

	buildMarkers() {
		const icon = L.icon({
			iconSize: [ 25, 41 ],
			iconAnchor: [ 13, 41 ],
			iconUrl: 'assets/leaflet/marker-icon.png',
			iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
			shadowUrl: 'assets/leaflet/marker-shadow.png'
		});

		this.targetMarker = L.marker(this.TARGET_LATLNG, { icon });

		const markers: L.Marker[] = [this.targetMarker];
		for (let i = 0; i < 199; i++) {
			const lat = this.TARGET_LATLNG.lat + (Math.random() - 0.5) * 8;
			const lng = this.TARGET_LATLNG.lng + (Math.random() - 0.5) * 8;
			markers.push(L.marker(L.latLng(lat, lng), { icon }));
		}

		this.markerClusterData = markers;
	}

	onMapReady(map: L.Map) {
		this.map = map;
	}

	onClusterReady(group: L.MarkerClusterGroup) {
		this.markerClusterGroup = group;
	}

	resetView() {
		this.cancelTrials = true;
		this.runningMode = null;
		this.log = [];
		this.enableMapInteraction();
		this.map.setView(this.INITIAL_CENTER, this.INITIAL_ZOOM);
	}

	/**
	 * Broken: zoomToShowLayer called inside Angular's zone. zone.js patches
	 * requestAnimationFrame, wrapping every animation frame in a zone task that
	 * runs change detection. This contends with leaflet.markercluster's icon-update
	 * timing and can cause the callback to be silently dropped.
	 */
	async zoomBroken() {
		if (this.runningMode) return;
		this.runningMode = 'broken';
		await this.runTrials('inside Angular zone', callback => {
			this.markerClusterGroup.zoomToShowLayer(this.targetMarker, callback);
		});
	}

	/**
	 * Fixed: zoomToShowLayer called outside Angular's zone. The same RAF pressure
	 * loop runs during each trial, but because the zoomToShowLayer call is wrapped
	 * in runOutsideAngular(), Leaflet's own animation runs with native RAF timing
	 * and the callback fires reliably every trial.
	 */
	async zoomFixed() {
		if (this.runningMode) return;
		this.runningMode = 'fixed';
		await this.runTrials('outside Angular zone', callback => {
			this.zone.runOutsideAngular(() => {
				this.markerClusterGroup.zoomToShowLayer(this.targetMarker, () => {
					this.zone.run(() => callback());
				});
			});
		});
	}

	// ---------------------------------------------------------------------------
	// Trial infrastructure
	// ---------------------------------------------------------------------------

	/**
	 * Shared trial loop used by both zoomBroken and zoomFixed. Disables map
	 * interaction for the duration so that manual zoom/pan can't interfere with
	 * results — the only variable being tested is whether the invoker calls
	 * zoomToShowLayer inside or outside the zone.
	 */
	private async runTrials(
		label: string,
		invoker: (callback: () => void) => void
	) {
		this.cancelTrials = false;
		this.disableMapInteraction();
		this.log = [{ message: `Running ${TRIAL_COUNT} trials ${label}…`, type: 'info' }];

		let successes = 0;
		let failures = 0;

		try {
			for (let trial = 1; trial <= TRIAL_COUNT; trial++) {
				if (this.cancelTrials) break;

				this.map.setView(this.INITIAL_CENTER, this.INITIAL_ZOOM);
				await this.sleep(RESET_SETTLE_MS);
				if (this.cancelTrials) break;

				const fired = await this.runSingleTrial(invoker);

				if (fired) { successes++; } else { failures++; }

				this.log = [
					...this.log,
					{
						message: `Trial ${trial}: ${fired ? '✅ callback fired' : '⚠️ callback dropped'}`,
						type: fired ? 'success' : 'warning'
					}
				];

				await this.sleep(100);
			}

			if (!this.cancelTrials) {
				this.log = [
					...this.log,
					{
						message: `${successes}/${TRIAL_COUNT} fired, ${failures}/${TRIAL_COUNT} dropped`,
						type: failures === 0 ? 'success' : 'warning'
					}
				];
			}
		} finally {
			this.enableMapInteraction();
			this.runningMode = null;
		}
	}

	/**
	 * Runs a single trial: starts zone pressure (RAF loop + setInterval flood),
	 * invokes the provided zoomToShowLayer call, waits for callback or timeout.
	 */
	private async runSingleTrial(invoker: (callback: () => void) => void): Promise<boolean> {
		// RAF loop inside the zone — zone.js patches RAF, so each frame becomes
		// a zone task that triggers change detection. Same overhead a real Angular
		// app creates during a zoom animation.
		let rafActive = true;
		const rafLoop = () => { if (rafActive) requestAnimationFrame(rafLoop); };
		requestAnimationFrame(rafLoop);

		// setInterval flood — additional high-frequency zone tasks.
		const intervalId = setInterval(() => {}, 0);

		try {
			return await new Promise<boolean>(resolve => {
				const timer = setTimeout(() => resolve(false), TRIAL_TIMEOUT_MS);
				invoker(() => {
					clearTimeout(timer);
					resolve(true);
				});
			});
		} finally {
			rafActive = false;
			clearInterval(intervalId);
		}
	}

	// ---------------------------------------------------------------------------
	// Map interaction helpers
	// ---------------------------------------------------------------------------

	private disableMapInteraction() {
		this.map.dragging.disable();
		this.map.scrollWheelZoom.disable();
		this.map.doubleClickZoom.disable();
		this.map.keyboard.disable();
		this.map.touchZoom.disable();
		this.map.boxZoom.disable();
		if (this.map.zoomControl) { this.map.zoomControl.remove(); }
	}

	private enableMapInteraction() {
		this.map.dragging.enable();
		this.map.scrollWheelZoom.enable();
		this.map.doubleClickZoom.enable();
		this.map.keyboard.enable();
		this.map.touchZoom.enable();
		this.map.boxZoom.enable();
		if (this.map.zoomControl) { this.map.zoomControl.addTo(this.map); }
	}

	private sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

}
