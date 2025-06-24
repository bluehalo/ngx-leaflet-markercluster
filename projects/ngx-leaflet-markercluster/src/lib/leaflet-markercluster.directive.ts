import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';

import { LeafletDirective, LeafletDirectiveWrapper } from '@bluehalo/ngx-leaflet';

import { Layer, MarkerClusterGroup, MarkerClusterGroupOptions } from 'leaflet';
import 'leaflet.markercluster';

@Directive({
    selector: '[leafletMarkerCluster]',
})
export class LeafletMarkerClusterDirective
implements OnChanges, OnInit {

	leafletDirective: LeafletDirectiveWrapper;
	markerClusterGroup: MarkerClusterGroup;

	// Hexbin data binding
	@Input('leafletMarkerCluster') markerData: Layer[] = [];

	// Options binding
	@Input('leafletMarkerClusterOptions') markerClusterOptions: MarkerClusterGroupOptions;

	// Fired when the marker cluster is created
	@Output('leafletMarkerClusterReady') markerClusterReady: EventEmitter<MarkerClusterGroup> = new EventEmitter<MarkerClusterGroup>();


	constructor(leafletDirective: LeafletDirective) {
		this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
	}

	ngOnInit() {

		this.leafletDirective.init();

		const map = this.leafletDirective.getMap();
		this.markerClusterGroup = window.L.markerClusterGroup(this.markerClusterOptions);

		// Add the marker cluster group to the map
		this.markerClusterGroup.addTo(map);

		// Set the data now that the markerClusterGroup exists
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

	private setData(layers: Layer[]) {

		// Ignore until the markerClusterGroup exists
		if (null != this.markerClusterGroup) {
			this.markerClusterGroup.clearLayers();
			this.markerClusterGroup.addLayers(layers);
		}

	}

}
