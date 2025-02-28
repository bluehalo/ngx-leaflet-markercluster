import { NgModule } from '@angular/core';

import { LeafletMarkerClusterDirective } from './leaflet-markercluster.directive';

@NgModule({
	exports: [ LeafletMarkerClusterDirective ],
	imports: [ LeafletMarkerClusterDirective ],
})
export class LeafletMarkerClusterModule {

}
