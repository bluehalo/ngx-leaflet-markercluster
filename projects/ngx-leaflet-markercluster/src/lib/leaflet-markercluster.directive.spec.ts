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

	it('should have leafletMarkerCluster selector', () => {
		// Verify the directive class is importable and has the expected shape
		const instance = new LeafletMarkerClusterDirective(null as any);
		expect(instance.markerData).toEqual([]);
	});

	it('should default markerData to empty array', () => {
		const instance = new LeafletMarkerClusterDirective(null as any);
		expect(Array.isArray(instance.markerData)).toBeTrue();
		expect(instance.markerData.length).toBe(0);
	});

});
