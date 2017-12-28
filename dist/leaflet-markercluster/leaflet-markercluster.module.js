import { ModuleWithProviders, NgModule } from '@angular/core';
import { LeafletMarkerClusterDirective } from './leaflet-markercluster.directive';
var LeafletMarkerClusterModule = /** @class */ (function () {
    function LeafletMarkerClusterModule() {
    }
    LeafletMarkerClusterModule.forRoot = function () {
        return { ngModule: LeafletMarkerClusterModule, providers: [] };
    };
    LeafletMarkerClusterModule.decorators = [
        { type: NgModule, args: [{
                    exports: [LeafletMarkerClusterDirective],
                    declarations: [LeafletMarkerClusterDirective]
                },] },
    ];
    /** @nocollapse */
    LeafletMarkerClusterModule.ctorParameters = function () { return []; };
    return LeafletMarkerClusterModule;
}());
export { LeafletMarkerClusterModule };
//# sourceMappingURL=leaflet-markercluster.module.js.map