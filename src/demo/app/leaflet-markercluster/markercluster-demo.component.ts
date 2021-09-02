import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.markercluster';

@Component({
	selector: 'markercluster-demo',
	templateUrl: './markercluster-demo.component.html'
})
export class MarkerClusterDemoComponent
	implements OnInit {

	// Open Street Map Definition
	LAYER_OSM = {
		id: 'openstreetmap',
		name: 'Open Street Map',
		enabled: false,
		layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Open Street Map'
		})
	};

	// Values to bind to Leaflet Directive
	layersControlOptions = { position: 'bottomright' };
	baseLayers = {
		'Open Street Map': this.LAYER_OSM.layer
	};
	options = {
		zoom: 3,
		center: L.latLng([ 46.879966, -121.726909 ])
	};

	// Marker cluster stuff
	markerClusterGroup: L.MarkerClusterGroup;
	markerClusterData: L.Marker[] = [];
	markerClusterOptions: L.MarkerClusterGroupOptions;

	// Generators for lat/lon values
	generateLat() { return Math.random() * 360 - 180; }
	generateLon() { return Math.random() * 180 - 90; }


	ngOnInit() {

		this.refreshData();

	}

	markerClusterReady(group: L.MarkerClusterGroup) {

		this.markerClusterGroup = group;

	}

	refreshData(): void {
		this.markerClusterData = this.generateData(1000);
	}

	generateData(count: number): L.Marker[] {

		const data: L.Marker[] = [];

		for (let i = 0; i < count; i++) {

			const icon = L.icon({
				iconSize: [ 25, 41 ],
				iconAnchor: [ 13, 41 ],
				iconUrl: '2b3e1faf89f94a4835397e7a43b4f77d.png',
				iconRetinaUrl: '680f69f3c2e6b90c1812a813edf67fd7.png',
				shadowUrl: 'a0c6cc1401c107b501efee6477816891.png'
			});

			data.push(L.marker([ this.generateLat(), this.generateLon() ], { icon }));
		}

		return data;

	}

}
