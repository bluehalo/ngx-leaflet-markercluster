import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MarkerClusterDemoModule } from './leaflet-markercluster/markercluster-demo.module';


@NgModule({
	imports: [
		BrowserModule,
		MarkerClusterDemoModule
	],
	declarations: [
		AppComponent
	],
	bootstrap: [ AppComponent ],
	providers: [ ]
})
export class AppModule { }
