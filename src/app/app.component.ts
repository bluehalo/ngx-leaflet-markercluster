import { Component } from '@angular/core';

import { MarkerClusterDemoComponent } from './leaflet-markercluster/markercluster-demo.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
    imports: [ MarkerClusterDemoComponent ]
})
export class AppComponent {
	// Empty component
}
