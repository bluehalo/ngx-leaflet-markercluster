import { Directive, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange } from '@angular/core';

import { LeafletDirective, LeafletDirectiveWrapper } from '@bluehalo/ngx-leaflet';

import { Layer, MarkerClusterGroup, MarkerClusterGroupOptions } from 'leaflet';
import 'leaflet.markercluster';

@Directive({
	selector: '[leafletMarkerCluster]',
})
export class LeafletMarkerClusterDirective
implements OnChanges, OnInit, OnDestroy {

	leafletDirective: LeafletDirectiveWrapper;
	markerClusterGroup: MarkerClusterGroup;

	// Tracks whether this directive created the MarkerClusterGroup (and should remove it on destroy).
	// When the caller provides [leafletMarkerClusterGroup], they own the group and we leave it alone.
	private _ownsMCG = false;

	// Marker data binding
	@Input('leafletMarkerCluster') markerData: Layer[] = [];

	// Options binding — ignored when [leafletMarkerClusterGroup] is provided
	@Input('leafletMarkerClusterOptions') markerClusterOptions: MarkerClusterGroupOptions;

	/**
	 * Optional pre-created MarkerClusterGroup to use instead of creating one internally.
	 * Use this when you need a sub-plugin factory such as
	 * `L.markerClusterGroup.layerSupport()` or `L.markerClusterGroup.freezable()`.
	 *
	 * When provided, `[leafletMarkerClusterOptions]` is ignored — configure the group
	 * via its factory call instead. The directive will NOT remove this group from the map
	 * on destroy; the caller is responsible for its lifecycle.
	 */
	@Input('leafletMarkerClusterGroup') inputClusterGroup: MarkerClusterGroup;

	// Fired when the marker cluster group is ready (whether created internally or provided externally)
	@Output('leafletMarkerClusterReady') markerClusterReady: EventEmitter<MarkerClusterGroup> = new EventEmitter<MarkerClusterGroup>();


	constructor(leafletDirective: LeafletDirective) {
		this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
	}

	ngOnInit() {

		this.leafletDirective.init();

		const map = this.leafletDirective.getMap();

		if (this.inputClusterGroup != null) {
			this.markerClusterGroup = this.inputClusterGroup;
			this._ownsMCG = false;
		} else {
			this.markerClusterGroup = window.L.markerClusterGroup(this.markerClusterOptions);
			this._ownsMCG = true;
		}

		// Add the marker cluster group to the map
		this.markerClusterGroup.addTo(map);

		// Set the data now that the markerClusterGroup exists
		this.setData(this.markerData);

		// Fire the ready event
		this.markerClusterReady.emit(this.markerClusterGroup);

	}

	ngOnChanges(changes: { [key: string]: SimpleChange }) {

		// Handle a runtime swap of the provided cluster group (after init)
		if (changes['inputClusterGroup'] && !changes['inputClusterGroup'].firstChange) {

			const map = this.leafletDirective.getMap();

			// Remove the old group only if we created it
			if (this._ownsMCG && this.markerClusterGroup != null) {
				this.markerClusterGroup.remove();
			}

			if (this.inputClusterGroup != null) {
				this.markerClusterGroup = this.inputClusterGroup;
				this._ownsMCG = false;
			} else {
				this.markerClusterGroup = window.L.markerClusterGroup(this.markerClusterOptions);
				this._ownsMCG = true;
			}

			this.markerClusterGroup.addTo(map);
			this.setData(this.markerData);
			this.markerClusterReady.emit(this.markerClusterGroup);

		}

		// Set the new data
		if (changes['markerData']) {
			this.setData(this.markerData);
		}

	}

	ngOnDestroy() {

		// Only remove the group from the map if this directive created it.
		// Caller-provided groups are owned by the caller.
		if (this._ownsMCG && this.markerClusterGroup != null) {
			this.markerClusterGroup.remove();
			this.markerClusterGroup = null;
		}

	}

	private setData(layers: Layer[]) {

		// Ignore until the markerClusterGroup exists
		if (null != this.markerClusterGroup) {
			this.markerClusterGroup.clearLayers();
			this.markerClusterGroup.addLayers(layers ?? []);
		}

	}

}
