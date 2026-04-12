import { Layer } from 'leaflet';

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
