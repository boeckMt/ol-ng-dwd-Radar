# ol-ng-dwd-Radar

[Angular](https://angular.io/) [OpenLayers](http://openlayers.org/) App which shows Radar data from [DWD](https://www.dwd.de/DE/wetter/warnungen_aktuell/objekt_einbindung/einbindung_karten_geowebservice.html)
[PWA](https://blog.angular-university.io/angular-service-worker/)


[demo](https://boeckmt.github.io/ol-ng-dwd-Radar/)

## Getting Started
```
git clone https://github.com/boeckMt/ol-ng-dwd-Radar.git
cd ol-ng-dwd-Radar
npm i
npm start
```

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.


## PWA
- check for new version of app(service-worker) //swUpdate.available.subscribe
- cache files of app and requested osm tiles with ngsw-config.json //with globs patern 

