import { Component, NgZone, OnInit } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { LeafletMarkerClusterDirective } from '../../../projects/ngx-leaflet-markercluster/src/public-api';

interface LogEntry {
	message: string;
	type: 'info' | 'success' | 'warning';
}

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
	// Target marker location — clustered with all other NYC-area markers at low zoom
	private readonly TARGET_LATLNG = L.latLng(40.7128, -74.0060);

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

	log: LogEntry[] = [];

	private callbackTimer: ReturnType<typeof setTimeout> | null = null;

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

		// The target marker is the one we'll ask zoomToShowLayer to reveal
		this.targetMarker = L.marker(this.TARGET_LATLNG, { icon });

		const markers: L.Marker[] = [this.targetMarker];

		// 49 more markers scattered near NYC so they form a deep cluster at low zoom
		for (let i = 0; i < 49; i++) {
			const lat = this.TARGET_LATLNG.lat + (Math.random() - 0.5) * 4;
			const lng = this.TARGET_LATLNG.lng + (Math.random() - 0.5) * 4;
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

	reset() {
		this.clearTimer();
		this.log = [];
		this.map.setView(this.INITIAL_CENTER, this.INITIAL_ZOOM);
	}

	/**
	 * Broken pattern: zoomToShowLayer called inside Angular's zone.
	 *
	 * zone.js patches requestAnimationFrame. This changes the timing of
	 * leaflet.markercluster's internal cluster icon rendering relative to map
	 * events. When a moveend event fires while a cluster icon is still being
	 * rebuilt, leaflet.markercluster silently drops the callback — it reaches
	 * a code path where neither the "icon present" nor "spiderfy needed" branch
	 * executes, so the callback is never called.
	 *
	 * The bug is intermittent and timing-dependent — it may not reproduce on
	 * every click. Use the 5-second timeout below to observe it.
	 */
	zoomBroken() {
		this.prepareZoom('Calling zoomToShowLayer() inside Angular zone...');

		this.markerClusterGroup.zoomToShowLayer(this.targetMarker, () => {
			this.onCallbackFired();
		});
	}

	/**
	 * Fixed pattern: zoomToShowLayer called outside Angular's zone.
	 *
	 * runOutsideAngular() keeps zone.js out of Leaflet's event loop, restoring
	 * native requestAnimationFrame timing. leaflet.markercluster's cluster icon
	 * rendering and map event sequencing work as intended, so the callback fires
	 * reliably. Re-enter the zone inside the callback to trigger change detection.
	 */
	zoomFixed() {
		this.prepareZoom('Calling zoomToShowLayer() outside Angular zone...');

		this.zone.runOutsideAngular(() => {
			this.markerClusterGroup.zoomToShowLayer(this.targetMarker, () => {
				this.zone.run(() => this.onCallbackFired());
			});
		});
	}

	private prepareZoom(message: string) {
		this.clearTimer();
		this.log = [{ message, type: 'info' }];

		// Fallback: if the callback hasn't fired in 5 seconds, report it as dropped
		this.callbackTimer = setTimeout(() => {
			this.zone.run(() => {
				this.log = [
					...this.log,
					{
						message: '⚠️  5 seconds elapsed — callback never fired (it was silently dropped).',
						type: 'warning'
					}
				];
				this.callbackTimer = null;
			});
		}, 5000);
	}

	private onCallbackFired() {
		this.clearTimer();
		this.log = [
			...this.log,
			{ message: '✅  Callback fired — marker is now visible.', type: 'success' }
		];
	}

	private clearTimer() {
		if (this.callbackTimer !== null) {
			clearTimeout(this.callbackTimer);
			this.callbackTimer = null;
		}
	}

}
