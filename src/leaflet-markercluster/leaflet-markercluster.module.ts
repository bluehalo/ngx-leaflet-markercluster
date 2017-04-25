import { ModuleWithProviders, NgModule } from '@angular/core';

import { LeafletMarkerClusterDirective } from './leaflet-markercluster.directive';

@NgModule({
	exports: [ LeafletMarkerClusterDirective ],
	declarations: [ LeafletMarkerClusterDirective ]
})
export class LeafletMarkerClusterModule {

	static forRoot(): ModuleWithProviders {
		return { ngModule: LeafletMarkerClusterModule, providers: [] };
	}

}
