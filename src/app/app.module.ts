import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MarkerClusterDemoComponent } from './leaflet-markercluster/markercluster-demo.component';


@NgModule({
	imports: [
		BrowserModule,
		MarkerClusterDemoComponent
	],
})
export class AppModule { }
