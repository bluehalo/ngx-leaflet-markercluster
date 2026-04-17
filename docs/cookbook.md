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

The [demo app](../src/app/zoom-to-show/zoom-to-show-demo.component.ts) includes a live example
of both patterns with a status log showing whether the callback fired.

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
