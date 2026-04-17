import { Component } from '@angular/core';

import { MarkerClusterDemoComponent } from './leaflet-markercluster/markercluster-demo.component';
import { ZoomToShowDemoComponent } from './zoom-to-show/zoom-to-show-demo.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
    imports: [ MarkerClusterDemoComponent, ZoomToShowDemoComponent ]
})
export class AppComponent {
	// Empty component
}
