import { NgModule } from '@angular/core';

import { LeafletMarkerClusterDirective } from './leaflet-markercluster.directive';

@NgModule({
    imports: [ LeafletMarkerClusterDirective ],
    exports: [ LeafletMarkerClusterDirective ]
})
export class LeafletMarkerClusterModule {

}
