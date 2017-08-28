import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { LeafletDirective, LeafletDirectiveWrapper } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import 'leaflet.markercluster';
var LeafletMarkerClusterDirective = (function () {
    function LeafletMarkerClusterDirective(leafletDirective) {
        // Hexbin data binding
        this.markerData = [];
        // Fired when the marker cluster is created
        this.markerClusterReady = new EventEmitter();
        this.leafletDirective = new LeafletDirectiveWrapper(leafletDirective);
    }
    LeafletMarkerClusterDirective.prototype.ngOnInit = function () {
        this.leafletDirective.init();
        var map = this.leafletDirective.getMap();
        this.markerClusterGroup = L.markerClusterGroup(this.markerClusterOptions);
        // Fire the ready event
        this.markerClusterReady.emit(this.markerClusterGroup);
        // Add the marker cluster group to the map
        this.markerClusterGroup.addTo(map);
        // Set the data
        this.setData(this.markerData);
    };
    LeafletMarkerClusterDirective.prototype.ngOnChanges = function (changes) {
        // Set the new data
        if (changes['markerData']) {
            this.setData(this.markerData);
        }
    };
    LeafletMarkerClusterDirective.prototype.setData = function (layers) {
        if (null != this.markerClusterGroup) {
            this.markerClusterGroup.clearLayers();
            this.markerClusterGroup.addLayers(layers);
        }
    };
    return LeafletMarkerClusterDirective;
}());
export { LeafletMarkerClusterDirective };
LeafletMarkerClusterDirective.decorators = [
    { type: Directive, args: [{
                selector: '[leafletMarkerCluster]',
            },] },
];
/** @nocollapse */
LeafletMarkerClusterDirective.ctorParameters = function () { return [
    { type: LeafletDirective, },
]; };
LeafletMarkerClusterDirective.propDecorators = {
    'markerData': [{ type: Input, args: ['leafletMarkerCluster',] },],
    'markerClusterOptions': [{ type: Input, args: ['leafletMarkerClusterOptions',] },],
    'markerClusterReady': [{ type: Output, args: ['leafletMarkerClusterReady',] },],
};
//# sourceMappingURL=leaflet-markercluster.directive.js.map