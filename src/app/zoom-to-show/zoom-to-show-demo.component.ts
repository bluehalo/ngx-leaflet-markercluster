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


// How long to wait (ms) after resetting the map before each trial.
// Must be > 300ms to let leaflet.markercluster's _enqueue timeout settle.
const RESET_SETTLE_MS = 500;

// Per-trial callback timeout (ms). The zoom animation + animationend typically
// completes in < 1 second; 3 seconds is ample.
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

	log: LogEntry[] = [];
	isRunning = false;

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
		// More markers spread over a wider area to deepen the cluster hierarchy
		// and give the animation engine more work to do during each trial.
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
		this.isRunning = false;
		this.log = [];
		this.map.setView(this.INITIAL_CENTER, this.INITIAL_ZOOM);
	}

	/**
	 * Broken pattern — runs TRIAL_COUNT trials inside Angular's zone.
	 *
	 * Each trial starts a requestAnimationFrame loop inside the zone to simulate
	 * the overhead a busy Angular app creates during a zoom animation. zone.js
	 * patches requestAnimationFrame; Leaflet's animation loop also uses RAF.
	 * The resulting contention between zone change-detection cycles and
	 * leaflet.markercluster's icon-update timing is what triggers the silent drop.
	 *
	 * Not every trial will fail — the race is probabilistic — but running
	 * TRIAL_COUNT attempts makes it likely to surface at least once.
	 */
	async zoomBroken() {
		if (this.isRunning) return;
		this.cancelTrials = false;
		this.isRunning = true;
		this.log = [{ message: `Running ${TRIAL_COUNT} trials inside Angular zone…`, type: 'info' }];

		let successes = 0;
		let failures = 0;

		for (let trial = 1; trial <= TRIAL_COUNT; trial++) {
			if (this.cancelTrials) break;

			// Reset to initial zoom so the target marker is clustered again
			this.map.setView(this.INITIAL_CENTER, this.INITIAL_ZOOM);
			await this.sleep(RESET_SETTLE_MS);
			if (this.cancelTrials) break;

			// Start a requestAnimationFrame loop inside the zone. zone.js patches
			// RAF, so each frame becomes a zone task and triggers change detection.
			// This is the same overhead a real Angular app has during animation.
			let rafActive = true;
			const rafLoop = () => { if (rafActive) requestAnimationFrame(rafLoop); };
			requestAnimationFrame(rafLoop);

			// Also flood with setInterval(0) tasks — each one runs change detection.
			const intervalId = setInterval(() => {}, 0);

			const fired = await new Promise<boolean>(resolve => {
				const timer = setTimeout(() => resolve(false), TRIAL_TIMEOUT_MS);
				this.markerClusterGroup.zoomToShowLayer(this.targetMarker, () => {
					clearTimeout(timer);
					resolve(true);
				});
			});

			rafActive = false;
			clearInterval(intervalId);

			if (fired) successes++; else failures++;

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
			const allGood = failures === 0;
			this.log = [
				...this.log,
				{
					message: `${successes}/${TRIAL_COUNT} fired, ${failures}/${TRIAL_COUNT} dropped`,
					type: allGood ? 'success' : 'warning'
				}
			];
		}

		this.isRunning = false;
	}

	/**
	 * Fixed pattern — runs the same TRIAL_COUNT trials with the same zone pressure
	 * as zoomBroken(), but calls zoomToShowLayer outside Angular's zone.
	 *
	 * runOutsideAngular() prevents zone.js from wrapping Leaflet's RAF callbacks
	 * in zone tasks. Even with the RAF pressure loop running in the background,
	 * Leaflet's own animation runs with native timing, so the callback fires
	 * reliably every trial. Re-enter the zone inside the callback so that the
	 * log update triggers change detection.
	 */
	async zoomFixed() {
		if (this.isRunning) return;
		this.cancelTrials = false;
		this.isRunning = true;
		this.log = [{ message: `Running ${TRIAL_COUNT} trials outside Angular zone…`, type: 'info' }];

		let successes = 0;
		let failures = 0;

		for (let trial = 1; trial <= TRIAL_COUNT; trial++) {
			if (this.cancelTrials) break;

			this.map.setView(this.INITIAL_CENTER, this.INITIAL_ZOOM);
			await this.sleep(RESET_SETTLE_MS);
			if (this.cancelTrials) break;

			// Same zone pressure as the broken trials — RAF loop + setInterval flood.
			// The difference is only in how zoomToShowLayer is called below.
			let rafActive = true;
			const rafLoop = () => { if (rafActive) requestAnimationFrame(rafLoop); };
			requestAnimationFrame(rafLoop);

			const intervalId = setInterval(() => {}, 0);

			const fired = await new Promise<boolean>(resolve => {
				const timer = setTimeout(() => resolve(false), TRIAL_TIMEOUT_MS);

				// Only this call differs from the broken version:
				// zoomToShowLayer runs outside the zone, preserving native RAF timing.
				this.zone.runOutsideAngular(() => {
					this.markerClusterGroup.zoomToShowLayer(this.targetMarker, () => {
						this.zone.run(() => {
							clearTimeout(timer);
							resolve(true);
						});
					});
				});
			});

			rafActive = false;
			clearInterval(intervalId);

			if (fired) successes++; else failures++;

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
			const allGood = failures === 0;
			this.log = [
				...this.log,
				{
					message: `${successes}/${TRIAL_COUNT} fired, ${failures}/${TRIAL_COUNT} dropped`,
					type: allGood ? 'success' : 'warning'
				}
			];
		}

		this.isRunning = false;
	}

	private sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

}
