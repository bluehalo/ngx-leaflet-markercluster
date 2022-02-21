import { NgModule } from '@angular/core';

// Local Imports
import { MarkerClusterDemoComponent } from './markercluster-demo.component';
import { LeafletMarkerClusterModule } from '../../../projects/ngx-leaflet-markercluster/src/lib/leaflet-markercluster.module';

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
