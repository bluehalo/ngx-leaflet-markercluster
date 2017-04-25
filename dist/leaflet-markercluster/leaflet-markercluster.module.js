import { NgModule } from '@angular/core';
import { LeafletMarkerClusterDirective } from './leaflet-markercluster.directive';
var LeafletMarkerClusterModule = (function () {
    function LeafletMarkerClusterModule() {
    }
    LeafletMarkerClusterModule.forRoot = function () {
        return { ngModule: LeafletMarkerClusterModule, providers: [] };
    };
    return LeafletMarkerClusterModule;
}());
export { LeafletMarkerClusterModule };
LeafletMarkerClusterModule.decorators = [
    { type: NgModule, args: [{
                exports: [LeafletMarkerClusterDirective],
                declarations: [LeafletMarkerClusterDirective]
            },] },
];
/** @nocollapse */
LeafletMarkerClusterModule.ctorParameters = function () { return []; };
//# sourceMappingURL=leaflet-markercluster.module.js.map