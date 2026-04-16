# @bluehalo/ngx-leaflet-markercluster — API Reference

> Full API reference. For installation and quick-start usage, see the [README](../README.md).

## leafletMarkerCluster

Attribute directive that initiates the marker cluster plugin and binds the marker data.

## leafletMarkerClusterOptions

Input binding for the options to be passed directly to the marker cluster plugin upon creation.
These options are only currently processed at creation time.

The options object is passed through to the leaflet.markercluster object.
Therefore, you can reference [their documentation](https://github.com/Leaflet/Leaflet.markercluster) for help configuring this plugin.

## leafletMarkerClusterReady

Optional output event emitter that exposes the `MarkerClusterGroup` being used by the plugin.

```angular181html
<div style="height: 400px;"
     leaflet
     [leafletOptions]="options"
     [leafletMarkerCluster]="markerClusterData"
     [leafletMarkerClusterOptions]="markerClusterOptions"
     (leafletMarkerClusterReady)="markerClusterReady($event)">
</div>
```

In your component file, add these imports at the top:

```typescript
import * as L from 'leaflet';
import 'leaflet.markercluster';
```

Then add the callback method:

```typescript
markerClusterReady(markerCluster: L.MarkerClusterGroup) {
	// Do stuff with group
}
```
