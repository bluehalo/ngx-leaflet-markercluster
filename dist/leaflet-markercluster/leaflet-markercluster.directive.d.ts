import { EventEmitter, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { LeafletDirective, LeafletDirectiveWrapper } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import 'leaflet.markercluster';
export declare class LeafletMarkerClusterDirective implements OnChanges, OnInit {
    leafletDirective: LeafletDirectiveWrapper;
    markerClusterGroup: L.MarkerClusterGroup;
    markerData: L.Layer[];
    markerClusterOptions: L.MarkerClusterGroupOptions;
    markerClusterReady: EventEmitter<L.MarkerClusterGroup>;
    constructor(leafletDirective: LeafletDirective);
    ngOnInit(): void;
    ngOnChanges(changes: {
        [key: string]: SimpleChange;
    }): void;
    private setData(layers);
}
