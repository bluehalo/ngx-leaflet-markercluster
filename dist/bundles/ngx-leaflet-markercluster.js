/*! @asymmetrik/ngx-leaflet-markercluster - 1.0.0 - Copyright Asymmetrik, Ltd. 2007-2018 - All Rights Reserved. + */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@asymmetrik/ngx-leaflet'), require('leaflet'), require('leaflet.markercluster')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@asymmetrik/ngx-leaflet', 'leaflet', 'leaflet.markercluster'], factory) :
	(factory((global.ngxLeafletMarkercluster = {}),global.ng.core,global.ngxLeaflet,global.L));
}(this, (function (exports,core,ngxLeaflet,L) { 'use strict';

var LeafletMarkerClusterDirective = /** @class */ (function () {
    function LeafletMarkerClusterDirective(leafletDirective) {
        // Hexbin data binding
        this.markerData = [];
        // Fired when the marker cluster is created
        this.markerClusterReady = new core.EventEmitter();
        this.leafletDirective = new ngxLeaflet.LeafletDirectiveWrapper(leafletDirective);
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
    LeafletMarkerClusterDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[leafletMarkerCluster]',
                },] },
    ];
    /** @nocollapse */
    LeafletMarkerClusterDirective.ctorParameters = function () { return [
        { type: ngxLeaflet.LeafletDirective, },
    ]; };
    LeafletMarkerClusterDirective.propDecorators = {
        "markerData": [{ type: core.Input, args: ['leafletMarkerCluster',] },],
        "markerClusterOptions": [{ type: core.Input, args: ['leafletMarkerClusterOptions',] },],
        "markerClusterReady": [{ type: core.Output, args: ['leafletMarkerClusterReady',] },],
    };
    return LeafletMarkerClusterDirective;
}());

var LeafletMarkerClusterModule = /** @class */ (function () {
    function LeafletMarkerClusterModule() {
    }
    LeafletMarkerClusterModule.forRoot = function () {
        return { ngModule: LeafletMarkerClusterModule, providers: [] };
    };
    LeafletMarkerClusterModule.decorators = [
        { type: core.NgModule, args: [{
                    exports: [LeafletMarkerClusterDirective],
                    declarations: [LeafletMarkerClusterDirective]
                },] },
    ];
    /** @nocollapse */
    LeafletMarkerClusterModule.ctorParameters = function () { return []; };
    return LeafletMarkerClusterModule;
}());

exports.LeafletMarkerClusterModule = LeafletMarkerClusterModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-leaflet-markercluster.js.map
