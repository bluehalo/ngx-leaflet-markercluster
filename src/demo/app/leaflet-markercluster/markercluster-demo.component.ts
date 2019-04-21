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

		this.markerClusterData = this.generateData(1000);

	}

	markerClusterReady(group: L.MarkerClusterGroup) {

		this.markerClusterGroup = group;

	}

	generateData(count: number): L.Marker[] {

		const data: L.Marker[] = [];

		for (let i = 0; i < count; i++) {

			const icon = L.icon({
				iconUrl: '2273e3d8ad9264b7daa5bdbf8e6b47f8.png',
				shadowUrl: '44a526eed258222515aa21eaffd14a96.png'
			});

			data.push(L.marker([ this.generateLon(), this.generateLat() ], { icon }));
		}

		return data;

	}

}
