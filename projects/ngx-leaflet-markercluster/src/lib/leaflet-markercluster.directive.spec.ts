import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { latLng, Map as LeafletMap, Layer, marker, MarkerClusterGroup } from 'leaflet';

import { LeafletModule } from '@bluehalo/ngx-leaflet';

import { LeafletMarkerClusterDirective } from './leaflet-markercluster.directive';
import { LeafletMarkerClusterModule } from './leaflet-markercluster.module';


describe('LeafletMarkerClusterModule', () => {

	it('should be defined', () => {
		expect(LeafletMarkerClusterModule).toBeDefined();
	});

});


describe('LeafletMarkerClusterDirective', () => {

	it('should be defined', () => {
		expect(LeafletMarkerClusterDirective).toBeDefined();
	});

	it('should default markerData to empty array', () => {
		const instance = new LeafletMarkerClusterDirective(null as any);
		expect(Array.isArray(instance.markerData)).toBeTrue();
		expect(instance.markerData.length).toBe(0);
	});


	// -------------------------------------------------------------------------
	// setData null guard — protects against regression of v21.0.1 bug fix.
	// Before the fix, passing null/undefined layers caused clearLayers() to
	// receive null, crashing leaflet.markercluster on init.
	// -------------------------------------------------------------------------

	describe('setData null guard', () => {

		let instance: LeafletMarkerClusterDirective;
		let mockClusterGroup: jasmine.SpyObj<any>;

		beforeEach(() => {
			mockClusterGroup = jasmine.createSpyObj('MarkerClusterGroup', ['clearLayers', 'addLayers', 'addTo']);
			mockClusterGroup.addTo.and.returnValue(mockClusterGroup);

			instance = new LeafletMarkerClusterDirective(null as any);
			instance.markerClusterGroup = mockClusterGroup;
		});

		it('should coerce null layers to an empty array', () => {
			instance.markerData = null;
			instance.ngOnChanges({ markerData: { currentValue: null, previousValue: [], firstChange: false, isFirstChange: () => false } });

			expect(mockClusterGroup.clearLayers).toHaveBeenCalled();
			expect(mockClusterGroup.addLayers).toHaveBeenCalledWith([]);
		});

		it('should coerce undefined layers to an empty array', () => {
			instance.markerData = undefined;
			instance.ngOnChanges({ markerData: { currentValue: undefined, previousValue: [], firstChange: false, isFirstChange: () => false } });

			expect(mockClusterGroup.clearLayers).toHaveBeenCalled();
			expect(mockClusterGroup.addLayers).toHaveBeenCalledWith([]);
		});

		it('should pass a valid layers array through unchanged', () => {
			const layers = [{} as Layer, {} as Layer];
			instance.markerData = layers;
			instance.ngOnChanges({ markerData: { currentValue: layers, previousValue: [], firstChange: false, isFirstChange: () => false } });

			expect(mockClusterGroup.addLayers).toHaveBeenCalledWith(layers);
		});

		it('should not call clearLayers or addLayers before markerClusterGroup is initialized', () => {
			instance.markerClusterGroup = null;
			instance.markerData = null;
			instance.ngOnChanges({ markerData: { currentValue: null, previousValue: [], firstChange: false, isFirstChange: () => false } });

			expect(mockClusterGroup.clearLayers).not.toHaveBeenCalled();
			expect(mockClusterGroup.addLayers).not.toHaveBeenCalled();
		});

	});

});


// ---------------------------------------------------------------------------
// Smoke tests — full Angular lifecycle with a real Leaflet map
// ---------------------------------------------------------------------------

@Component({
	standalone: false,
	template: `<div leaflet
		[leafletOptions]="options"
		[leafletMarkerCluster]="markerData"
		[leafletMarkerClusterOptions]="clusterOptions"
		(leafletMapReady)="onMapReady($event)"
		(leafletMarkerClusterReady)="onClusterReady($event)">
	</div>`
})
class TestHostComponent {
	options = { zoom: 4, center: latLng(0, 0), maxZoom: 18 };
	markerData: Layer[] = [];
	clusterOptions: any = null;
	map: LeafletMap;
	clusterGroup: MarkerClusterGroup;
	onMapReady(m: LeafletMap) { this.map = m; }
	onClusterReady(g: MarkerClusterGroup) { this.clusterGroup = g; }
}

describe('LeafletMarkerClusterDirective smoke tests', () => {

	let fixture: ComponentFixture<TestHostComponent>;
	let host: TestHostComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ LeafletModule, LeafletMarkerClusterModule ],
			declarations: [ TestHostComponent ]
		});
		fixture = TestBed.createComponent(TestHostComponent);
		host = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		fixture.destroy();
	});

	it('creates a MarkerClusterGroup and adds it to the map on init', () => {
		const directive = fixture.debugElement.children[0].injector.get(LeafletMarkerClusterDirective);
		expect(directive.markerClusterGroup).toBeTruthy();
	});

	it('emits the cluster group via markerClusterReady', () => {
		const directive = fixture.debugElement.children[0].injector.get(LeafletMarkerClusterDirective);
		expect(host.clusterGroup).toBe(directive.markerClusterGroup);
	});

	it('updating markerData via ngOnChanges calls setData without throwing', () => {
		const directive = fixture.debugElement.children[0].injector.get(LeafletMarkerClusterDirective);
		const layers = [ marker(latLng(0, 0)), marker(latLng(1, 1)) ];
		directive.markerData = layers;
		expect(() => {
			directive.ngOnChanges({ markerData: { currentValue: layers, previousValue: [], firstChange: false, isFirstChange: () => false } });
		}).not.toThrow();
	});

	it('cluster group contains the layers after markerData update', () => {
		const directive = fixture.debugElement.children[0].injector.get(LeafletMarkerClusterDirective);
		const layers = [ marker(latLng(0, 0)), marker(latLng(1, 1)) ];
		directive.markerData = layers;
		directive.ngOnChanges({ markerData: { currentValue: layers, previousValue: [], firstChange: false, isFirstChange: () => false } });
		expect(directive.markerClusterGroup.getLayers().length).toBe(2);
	});

});
