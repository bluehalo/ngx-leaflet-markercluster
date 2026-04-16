# @bluehalo/ngx-leaflet-markercluster — Cookbook

> Common patterns and troubleshooting tips. For installation and quick-start usage, see the [README](../README.md).

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
