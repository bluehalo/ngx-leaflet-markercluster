import { Component, ChangeDetectionStrategy } from '@angular/core';

import { MarkerClusterDemoComponent } from './leaflet-markercluster/markercluster-demo.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ MarkerClusterDemoComponent ]
})
export class AppComponent {
	// Empty component
}
