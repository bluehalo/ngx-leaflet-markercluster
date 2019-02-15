import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';

import { LeafletDirective, LeafletDirectiveWrapper } from '@asymmetrik/ngx-leaflet';

import * as L from 'leaflet';
import 'leaflet.markercluster';

@Directive({
	selector: '[leafletMarkerCluster]',
})
export class LeafletMarkerClusterDirective
implements OnChanges, OnInit {

	leafletDirective: LeafletDirectiveWrapper;
	markerClusterGroup: L.MarkerClusterGroup;

	// Hexbin data binding
	@Input('leafletMarkerCluster') markerData: L.Layer[] = [];

	// Options binding
	@Input('leafletMarkerClusterOptions') markerClusterOptions: L.MarkerClusterGroupOptions;

	// Fired when the marker cluster is created
	@Output('leafletMarkerClusterReady') markerClusterReady: EventEmitter<L.MarkerClusterGroup> = new EventEmitter<L.MarkerClusterGroup>();


	constructor(leafletDirective: LeafletDirective) {
		this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
	}

	ngOnInit() {

		this.leafletDirective.init();

		const map = this.leafletDirective.getMap();
		this.markerClusterGroup = L.markerClusterGroup(this.markerClusterOptions);

		// Add the marker cluster group to the map
		this.markerClusterGroup.addTo(map);

		// Set the data
		this.setData(this.markerData);

		// Fire the ready event
		this.markerClusterReady.emit(this.markerClusterGroup);

	}

	ngOnChanges(changes: { [key: string]: SimpleChange }) {

		// Set the new data
		if (changes['markerData']) {
			this.setData(this.markerData);
		}

	}

	private setData(layers: L.Layer[]) {

		if (null != this.markerClusterGroup) {
			this.markerClusterGroup.clearLayers();
			this.markerClusterGroup.addLayers(layers);
		}

	}

}
