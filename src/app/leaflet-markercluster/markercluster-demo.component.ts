import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Control } from 'leaflet';
import LayersOptions = Control.LayersOptions;

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
			noWrap: true,
			attribution: 'Open Street Map'
		})
	};

	// Values to bind to Leaflet Directive
	layersControlOptions: LayersOptions = { position: 'bottomright' };
	baseLayers = {
		'Open Street Map': this.LAYER_OSM.layer
	};
	options = {
		zoom: 2,
		center: L.latLng([ 0, 0 ])
	};

	// Marker cluster stuff
	markerClusterGroup: L.MarkerClusterGroup;
	markerClusterData: L.Marker[] = [];
	markerClusterOptions: L.MarkerClusterGroupOptions;

	// Generators for lat/lon values
	generateLat() { return Math.random() * 180 - 90; }
	generateLon() { return Math.random() * 360 - 180; }


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
				iconUrl: 'assets/leaflet/marker-icon.png',
				iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
				shadowUrl: 'assets/leaflet/marker-shadow.png'
			});

			data.push(L.marker([ this.generateLat(), this.generateLon() ], { icon }));
		}

		return data;

	}

}
