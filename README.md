# @asymmetrik/angular2-leaflet-markercluster

[![Build Status][travis-image]][travis-url]

> Extension to the @asymmetrik/angular2-leaflet package for Angular 2+
> Provides leaflet.markercluster integration into Angular 2 projects. Compatible with Leaflet v1.0.x and @asymmetrik/leaflet-d3 v2.x

> Supports Angular v4, Ahead-of-Time compilation (AOT), and use in Angular-CLI based projects


## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)


## Install
Install the package and its peer dependencies via npm:
```
npm install leaflet
npm install leaflet.markercluster
npm install @asymmetrik/angular2-leaflet
npm install @asymmetrik/angular2-leaflet-markercluster
```

If you intend to use this library in a typescript project (utilizing the typings), you will need to also install the leaflet typings via npm:
```
npm install @types/leaflet
npm install @types/leaflet-markercluster
```

## Usage

This plugin is used with the [Angular 2 Leaflet plugin](https://github.com/Asymmetrik/angular2-leaflet).

To create a map, use the ```leaflet``` attribute directive. This directive must appear first.
You must specify an initial zoom/center and set of layers either via ```leafletOptions``` or by binding to ```leafletZoom```, ```leafletCenter```, and ```leafletLayers```.

```html
<div leaflet style="height: 400px;"
     leafletDraw
     [leafletMarkerCluster]="markerClusterData"
     [leafletMarkerClusterOptions]="markerClusterOptions">
</div>
```

Finally, to initialize and configure the leaflet markercluster plugin, use the following attribute directives:

### leafletMarkerCluster
This attribute is an attribute directive that initiates the marker cluster plugin. 

#### leafletMarkerClusterOptions
Input binding for the options to be passed directly to the marker cluster plugin upon creation.
These options are only currently processed at creation time. 
The options object is passed through to the leaflet.markercluster object.
Therefore, you can reference [their documentation](https://github.com/Leaflet/Leaflet.markercluster) for help configuring this plugin. 


### Getting a reference to the MarkerCluster Layer
There is an optional output event emitter that will expose the marker cluster
(leafletMarkerClusterReady)="markerClusterReady($event)"


## Contribute
PRs accepted. If you are part of Asymmetrik, please make contributions on feature branches off of the ```develop``` branch. If you are outside of Asymmetrik, please fork our repo to make contributions.

## License
See LICENSE in repository for details.

[travis-url]: https://travis-ci.org/Asymmetrik/angular2-leaflet-markercluster/
[travis-image]: https://travis-ci.org/Asymmetrik/angular2-leaflet-markercluster.svg
