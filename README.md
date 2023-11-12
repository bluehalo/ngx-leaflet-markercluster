# @asymmetrik/ngx-leaflet-markercluster

[![Build Status][travis-image]][travis-url]

[travis-url]: https://travis-ci.org/Asymmetrik/ngx-leaflet-markercluster/
[travis-image]: https://travis-ci.org/Asymmetrik/ngx-leaflet-markercluster.svg

> Extension to the @asymmetrik/ngx-leaflet package for Angular.io
> Provides leaflet.markercluster integration into Angular.io projects. Compatible with Leaflet v1.x and leaflet.markercluster v1.x
> Supports Angular v17 and Ivy, and use in Angular-CLI based projects


## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)


## Install
Install the package and its peer dependencies via npm:
```
npm install leaflet @asymmetrik/ngx-leaflet
npm install leaflet.markercluster @asymmetrik/ngx-leaflet-markercluster
```

If you intend to use this library in a typescript project (utilizing the typings), you will need to also install the leaflet typings via npm:
```
npm install @types/leaflet @types/leaflet.markercluster
```

## Usage
This plugin is used with the [Angular.io Leaflet plugin](https://github.com/Asymmetrik/ngx-leaflet).

The first step is to follow the instructions to get @asymmetrik/ngx-leaflet working.
Next, follow a similar process to install and configure this plugin.
Generally, the steps are:

- Install this package and its dependencies (see above).
- Import the leaflet.markercluster stylesheet (i.e., `node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css` and `.../MarkerCluster.css` for animations).  
   - Follow the same process as documented in `@asymmetrik/ngx-leaflet`.
- Import the `LeafletMarkerClusterModule` into your Angular application module and local module (if applicable).
- Create and configure a map (see docs below and/or demo) 

To create a map, use the ```leaflet``` attribute directive. This directive must appear first.
You must specify an initial zoom/center and set of layers either via ```leafletOptions``` or by binding to ```leafletZoom```, ```leafletCenter```, and ```leafletLayers```.

```html
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

```html
<div style="height: 400px;"
     leaflet
     [leafletOptions]="options"
     [leafletMarkerCluster]="markerClusterData"
     [leafletMarkerClusterOptions]="markerClusterOptions"
     (leafletMarkerClusterReady)="markerClusterReady($event)">
</div>
```

```js
markerClusterReady(markerCluster: L.MarkerClusterGroup) {
	// Do stuff with group
}
```


## Contribute
PRs accepted. If you are part of BlueHalo, please make contributions on feature branches off of the ```develop``` branch. If you are outside of BlueHalo, please fork our repo to make contributions.


## License
See LICENSE in repository for details.
