# @bluehalo/ngx-leaflet-markercluster — Cookbook

> Common patterns and examples. For installation and quick-start usage, see the [README](../README.md).

## zoomToShowLayer Callback Not Firing

`MarkerClusterGroup.zoomToShowLayer(marker, callback)` zooms and pans until the target marker is
visible, then fires a callback. In an Angular application the callback is sometimes silently
dropped — never called, with no error.

**Root cause:** Angular's `zone.js` patches `requestAnimationFrame`. This alters the timing of
`leaflet.markercluster`'s internal cluster icon rendering relative to map events. When a `moveend`
event fires while a cluster icon is still being rebuilt, `leaflet.markercluster` reaches a code
path where neither the "icon present" nor "spiderfy needed" branch executes, so the callback is
never scheduled. The bug is intermittent because it depends on animation frame timing.

> **Reproduction note:** This was originally reported against Angular 6/7 (circa 2018). In
> practice it has proven very difficult to reproduce in Angular 17+. Zone.js's RAF handling has
> been refined over those releases, and the specific timing window may rarely or never open in
> modern builds. The `runOutsideAngular` pattern below is still the correct way to call any
> Leaflet API that relies on native event sequencing — apply it if you observe dropped callbacks
> in your own application rather than proactively.

**Fix: call `zoomToShowLayer` outside Angular's zone**

```typescript
import { Component, NgZone } from '@angular/core';

@Component({ /* ... */ })
export class MyComponent {

  markerClusterGroup: L.MarkerClusterGroup;
  targetMarker: L.Marker;

  constructor(private zone: NgZone) {}

  // ❌ Broken — zone.js patches RAF and can cause the callback to be dropped
  zoomBroken() {
    this.markerClusterGroup.zoomToShowLayer(this.targetMarker, () => {
      console.log('marker is visible');  // may never run
    });
  }

  // ✅ Fixed — runOutsideAngular() restores native RAF timing
  zoomFixed() {
    this.zone.runOutsideAngular(() => {
      this.markerClusterGroup.zoomToShowLayer(this.targetMarker, () => {
        // Re-enter the zone inside the callback so change detection runs
        this.zone.run(() => {
          console.log('marker is visible');  // runs reliably
        });
      });
    });
  }

}
```

`runOutsideAngular()` keeps `zone.js` out of Leaflet's event loop, restoring the native
`requestAnimationFrame` behavior that `leaflet.markercluster` depends on. Calling
`this.zone.run()` inside the callback re-enters the zone so that any Angular state updates
trigger change detection normally.

---

## Using Sub-Plugins (LayerSupport, Freezable)

Some `leaflet.markercluster` sub-plugins require the cluster group to be created with a
different factory function — for example `L.markerClusterGroup.layerSupport()` or
`L.markerClusterGroup.freezable()`. The default `[leafletMarkerCluster]` directive always
calls `L.markerClusterGroup()` internally, so you cannot use these sub-plugins without
providing the group yourself.

**Solution: use `[leafletMarkerClusterGroup]` to pass in a pre-created group.**

```typescript
import { Component } from '@angular/core';
import { latLng, Layer } from 'leaflet';
declare const L: any; // or import via your preferred method

@Component({
  template: `
    <div leaflet
      [leafletOptions]="options"
      [leafletMarkerCluster]="markerData"
      [leafletMarkerClusterGroup]="clusterGroup"
      (leafletMarkerClusterReady)="onClusterReady($event)">
    </div>
  `
})
export class MyComponent {

  // Create the group with the sub-plugin factory before binding
  clusterGroup = L.markerClusterGroup.layerSupport();

  markerData: Layer[] = [ /* ... */ ];
  options = { zoom: 4, center: latLng(0, 0) };

  onClusterReady(group: any) {
    // group === this.clusterGroup — the directive emits the provided instance
  }

}
```

**Notes:**

- `[leafletMarkerClusterOptions]` is ignored when `[leafletMarkerClusterGroup]` is provided.
  Pass options directly to the factory call instead: `L.markerClusterGroup.layerSupport({ maxClusterRadius: 80 })`.
- The directive will **not** remove a provided group from the map on destroy — the caller
  owns its lifecycle.
- When `[leafletMarkerClusterGroup]` is absent, the directive creates its own group as it
  always has — fully backwards compatible.

---

## Troubleshooting: `L.markerClusterGroup is not a function`

This is the most common issue when using this library with Angular 17+ (which uses esbuild by default). It appears as:

```
TypeError: L.markerClusterGroup is not a function
TypeError: L2.markerClusterGroup is not a function  // minified variant in prod builds
```

**Root cause:** `leaflet.markercluster` is a UMD/CommonJS module. In Angular's esbuild builder, it may register itself on a different internal representation of the Leaflet object than the one your application accesses, leaving `markerClusterGroup` undefined. This is a bundling interop issue between esbuild and `leaflet.markercluster`'s UMD format.

**Fix 1 (recommended): Add to `allowedCommonJsDependencies` in `angular.json`**

```json
"build": {
  "options": {
    "allowedCommonJsDependencies": [
      "leaflet",
      "leaflet.markercluster"
    ]
  }
}
```

This tells esbuild to treat both packages as CommonJS modules and bundle them together, ensuring `leaflet.markercluster` registers on the same Leaflet instance your app uses.

**Fix 2: tsconfig interop flags**

If Fix 1 doesn't resolve it, also add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

**Fix 3: Import leaflet.markercluster as a global script (legacy)**

As an alternative, you can load both as global scripts in `angular.json` instead of as ES module imports:

```json
"scripts": [
  "node_modules/leaflet/dist/leaflet.js",
  "node_modules/leaflet.markercluster/dist/leaflet.markercluster.js"
]
```

This is the approach from pre-esbuild Angular and guarantees both libraries share the same global `L` object.

> This is a known interop issue between esbuild and `leaflet.markercluster`'s UMD bundling. See [#107](https://github.com/bluehalo/ngx-leaflet-markercluster/issues/107) for ongoing investigation and updates.
