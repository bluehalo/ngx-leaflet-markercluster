/*! @asymmetrik/angular2-leaflet-markercluster - 0.0.4 - Copyright Asymmetrik, Ltd. 2007-2017 - All Rights Reserved. + */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@asymmetrik/angular2-leaflet'), require('leaflet'), require('leaflet.markercluster')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@asymmetrik/angular2-leaflet', 'leaflet', 'leaflet.markercluster'], factory) :
	(factory((global.angular2Template = global.angular2Template || {}),global.ng.core,global.angular2Leaflet,global.L));
}(this, (function (exports,_angular_core,_asymmetrik_angular2Leaflet,L) { 'use strict';

var LeafletMarkerClusterDirective = (function () {
    function LeafletMarkerClusterDirective(leafletDirective) {
        // Hexbin data binding
        this.markerData = [];
        // Fired when the marker cluster is created
        this.markerClusterReady = new _angular_core.EventEmitter();
        this.leafletDirective = new _asymmetrik_angular2Leaflet.LeafletDirectiveWrapper(leafletDirective);
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
LeafletMarkerClusterDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[leafletMarkerCluster]',
            },] },
];
/** @nocollapse */
LeafletMarkerClusterDirective.ctorParameters = function () { return [
    { type: _asymmetrik_angular2Leaflet.LeafletDirective, },
]; };
LeafletMarkerClusterDirective.propDecorators = {
    'markerData': [{ type: _angular_core.Input, args: ['leafletMarkerCluster',] },],
    'markerClusterOptions': [{ type: _angular_core.Input, args: ['leafletMarkerClusterOptions',] },],
    'markerClusterReady': [{ type: _angular_core.Output, args: ['leafletMarkerClusterReady',] },],
};

var LeafletMarkerClusterModule = (function () {
    function LeafletMarkerClusterModule() {
    }
    LeafletMarkerClusterModule.forRoot = function () {
        return { ngModule: LeafletMarkerClusterModule, providers: [] };
    };
    return LeafletMarkerClusterModule;
}());
LeafletMarkerClusterModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                exports: [LeafletMarkerClusterDirective],
                declarations: [LeafletMarkerClusterDirective]
            },] },
];
/** @nocollapse */
LeafletMarkerClusterModule.ctorParameters = function () { return []; };

exports.LeafletMarkerClusterModule = LeafletMarkerClusterModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular2-leaflet-markercluster.js.map
