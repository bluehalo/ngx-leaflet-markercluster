# @bluehalo/ngx-leaflet-markercluster

[![Build Status][ci-image]][ci-url]

[ci-url]: https://github.com/bluehalo/ngx-leaflet-markercluster/actions/workflows/ci.yml
[ci-image]: https://github.com/bluehalo/ngx-leaflet-markercluster/actions/workflows/ci.yml/badge.svg

> Extension to the @bluehalo/ngx-leaflet package for Angular.io
> Provides leaflet.markercluster integration into Angular.io projects. Compatible with Leaflet v1.x and leaflet.markercluster v1.x


## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Contribute](#contribute)
- [License](#license)


## Install
Install the package and its peer dependencies via npm:
```
npm install leaflet @bluehalo/ngx-leaflet
npm install leaflet.markercluster @bluehalo/ngx-leaflet-markercluster
```

If you intend to use this library in a typescript project (utilizing the typings), you will need to also install the leaflet typings via npm:
```
npm install @types/leaflet @types/leaflet.markercluster
```

## Usage
This plugin is used with the [Angular.io Leaflet plugin](https://github.com/bluehalo/ngx-leaflet).

The first step is to follow the instructions to get @bluehalo/ngx-leaflet working.
Next, follow a similar process to install and configure this plugin.
Generally, the steps are:

- Install this package and its dependencies (see above).
- Import the leaflet.markercluster stylesheet (i.e., `node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css` and `.../MarkerCluster.css` for animations).  
   - Follow the same process as documented in `@bluehalo/ngx-leaflet`.
- Import the `LeafletMarkerClusterDirective` into your Angular application module and local module (if applicable).
- Create and configure a map (see docs below and/or demo) 

To create a map, use the ```leaflet``` attribute directive. This directive must appear first.
You must specify an initial zoom/center and set of layers either via ```leafletOptions``` or by binding to ```leafletZoom```, ```leafletCenter```, and ```leafletLayers```.

```angular181html
<div style="height: 400px;"
     leaflet
     [leafletOptions]="options"
     [leafletMarkerCluster]="markerClusterData"
     [leafletMarkerClusterOptions]="markerClusterOptions">
</div>
```

Finally, to initialize and configure the leaflet markercluster plugin, use the following attribute directives:

### leafletMarkerCluster
This attribute is an attribute directive that initiates the marker cluster plugin and binds the marker data. 

#### leafletMarkerClusterOptions
Input binding for the options to be passed directly to the marker cluster plugin upon creation.
These options are only currently processed at creation time.

The options object is passed through to the leaflet.markercluster object.
Therefore, you can reference [their documentation](https://github.com/Leaflet/Leaflet.markercluster) for help configuring this plugin. 


### Getting a reference to the MarkerCluster Layer
There is an optional output event emitter that will expose the markercluster group being used by the plugin called ```leafletMarkerClusterReady```.
See the following example:

```angular181html
<div style="height: 400px;"
     leaflet
     [leafletOptions]="options"
     [leafletMarkerCluster]="markerClusterData"
     [leafletMarkerClusterOptions]="markerClusterOptions"
     (leafletMarkerClusterReady)="markerClusterReady($event)">
</div>
```

```typescript
markerClusterReady(markerCluster: L.MarkerClusterGroup) {
	// Do stuff with group
}
```


## Troubleshooting

### `L.markerClusterGroup is not a function`

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


## Contribute
PRs accepted. If you are part of BlueHalo, please make contributions on feature branches off of the ```develop``` branch. If you are outside of BlueHalo, please fork our repo to make contributions.


## License
See LICENSE in repository for details.
