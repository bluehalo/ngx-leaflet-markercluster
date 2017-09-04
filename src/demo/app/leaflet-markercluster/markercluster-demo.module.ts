import { NgModule } from '@angular/core';

// Local Imports
import { MarkerClusterDemoComponent } from './markercluster-demo.component';
import { LeafletMarkerClusterModule } from '../../../leaflet-markercluster/leaflet-markercluster.module';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';


@NgModule({
	imports: [
		LeafletModule,
		LeafletMarkerClusterModule
	],
	declarations: [
		MarkerClusterDemoComponent
	],
	exports: [
		MarkerClusterDemoComponent
	],
	bootstrap: [ MarkerClusterDemoComponent ],
	providers: [ ]
})
export class MarkerClusterDemoModule { }
