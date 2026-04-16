# @bluehalo/ngx-leaflet-markercluster

[![Build Status][ci-image]][ci-url]
[![Code Coverage][coverage-image]][coverage-url]

[ci-url]: https://github.com/bluehalo/ngx-leaflet-markercluster/actions/workflows/ci.yml
[ci-image]: https://github.com/bluehalo/ngx-leaflet-markercluster/actions/workflows/ci.yml/badge.svg
[coverage-url]: https://codecov.io/gh/bluehalo/ngx-leaflet-markercluster
[coverage-image]: https://codecov.io/gh/bluehalo/ngx-leaflet-markercluster/graph/badge.svg

> Extension to the @bluehalo/ngx-leaflet package for Angular.io
> Provides leaflet.markercluster integration into Angular.io projects. Compatible with Leaflet v1.x and leaflet.markercluster v1.x


## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [API](docs/API.md)
- [Cookbook](docs/cookbook.md)
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


## API

Full API documentation is in [docs/API.md](docs/API.md). It covers:
- `[leafletMarkerCluster]` — directive activation and data input
- `[leafletMarkerClusterOptions]` — options passed through to `leaflet.markercluster`
- `(leafletMarkerClusterReady)` — output event for accessing the `MarkerClusterGroup` instance


## Cookbook

Common patterns and examples are in [docs/cookbook.md](docs/cookbook.md), including:
- [Troubleshooting: `L.markerClusterGroup is not a function`](docs/cookbook.md#troubleshooting-lmarkerclustergroup-is-not-a-function) — three fixes for the esbuild/CommonJS interop issue


## Contribute
PRs accepted. Please make contributions on feature branches and open a pull request against `master`.


## License
See [LICENSE](LICENSE) for details.


## Credits
**[Leaflet](http://leafletjs.com/)** Is an awesome mapping package.
**[leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)** Is the underlying clustering plugin this library wraps.
