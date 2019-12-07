import { Component, AfterViewInit, ViewEncapsulation, OnInit } from '@angular/core';

import { IdateChange } from './time-slider/time-slider.component';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MatSlider } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';

import View from 'ol/View';
import { transform } from 'ol/proj.js';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import LayerGroup from 'ol/layer/Group';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import TileWMS from 'ol/source/TileWMS';

import TileGrid from 'ol/tilegrid/TileGrid';
import {getWidth} from 'ol/extent';
import {get as getProjection} from 'ol/proj';

import { PwaHelper } from './pwa.helper';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  map: Map;
  view: View;
  EPSGCODE = 'EPSG:3857';
  capabilities: {[s: string]: any};

  mapState: { center: [number, number], zoom: number };
  wmsurl = 'https://maps.dwd.de/geoserver/dwd/wms';
  weatherlayers = [
    { value: 'Fachlayer.Wetter.Radar.FX-Produkt', viewValue: 'Radarvorhersage' },
    { value: 'Fachlayer.Wetter.Mittelfristvorhersagen.GefuehlteTemp', viewValue: 'Gefühlte Temperatur' },
    { value: 'Fachlayer.Wetter.Beobachtungen.RBSN_T2m', viewValue: 'Temperatur 2m' },
    { value: 'Fachlayer.Wetter.Satellit.SAT_EU_central_RGB_cloud', viewValue: 'Satellitenbild' }
  ];
  weatherlayername = new FormControl(this.weatherlayers[0].value);
  timeSource: TileWMS;
  layer: TileLayer;
  /** EPSG:3857 */
  fallbackExtent = [183082.1073087257, 5345076.652029778, 2017570.7861529556, 7786169.587345167];
  /** Muenchen */
  startCenter = [1288323.189210665, 6134720.493257317];
  // preloadSource: TileWMS;
  // prelayer: TileLayer;

  datesString: string[];
  slidervalue: string;

  legendurl = '';
  progressBarMode: 'indeterminate' | '' = 'indeterminate';
  legend = false;

  layertitle = 'DWD Radar';
  layerdescription = '';
  dwdinfo: {
    link: string,
    title: string
  } = { link: null, title: null };

  constructor(private snackbar: MatSnackBar, private pwaHelper: PwaHelper) {
    this.pwaHelper.checkUpdates();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (this.checkIfLocationInGermany()) {
          this.map.setView(new View({
            center: transform([position.coords.longitude, position.coords.latitude], 'EPSG:4326', this.EPSGCODE),
            zoom: 7
          }));
        }
      });
    }
  }

  // TODO
  checkIfLocationInGermany() {
    return true;
  }

  isLoading() {
    return this.progressBarMode === 'indeterminate';
  }

  refresh(loadCaps: boolean) {
    this.afterInit(loadCaps);
  }

  showLegend() {
    this.legend = !this.legend;
  }

  produktChange(value) {
    const loadCaps = false;
    this.refresh(loadCaps);
  }

  ngOnInit() {
    this.initMap();
  }

  initMap(){
    this.view = new View({
      center: this.startCenter,
      zoom: 9
    });

    const baselayer = new TileLayer({
      preload: Infinity,
      source: new XYZ({
        // url: `https://tile.osmand.net/hd/{z}/{x}/{y}.png`
        url: `https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png`
      })
    });

    const baselayers = new LayerGroup({
      name: 'baselayers',
      layers: [baselayer]
    });

    const overlays = new LayerGroup({
      name: 'overlays'
    });

    this.map = new Map({
      view: this.view,
      projection: this.EPSGCODE,
      layers: [
        baselayers,
        overlays
      ],
      controls: [],
      target: 'map'
    });


    this.map.on('click', (evt) => {
      const zoom = this.map.getView().getZoom();
      const center = this.map.getView().getCenter();
      const extent = this.map.getView().calculateExtent(this.map.getSize());
      console.log(zoom, center, extent);
    });


    // this.getLocation();
    const loadCaps = true;
    this.afterInit(loadCaps);
  }

  afterInit(loadCaps: boolean) {
    this.progressBarMode = 'indeterminate';
    this.view.setRotation(0);
    const overlays = this.getOverlays();
    overlays.getLayers().clear();
    this.getWmsCaps(loadCaps);
  }


  sliderOnChange(value: IdateChange) {
    // console.log(value.last, value.now, value.next)
    if (this.timeSource && this.timeSource.updateParams) {

      const time = new Date(value.now);

      // console.log(time.toISOString())
      this.slidervalue = time.toISOString();
      this.timeSource.updateParams({ 'TIME': value.now });

      if (value.next) {
        const preloadtime = new Date(value.next);
        // console.log(preloadtime.toISOString())
        // this.preloadSource.updateParams({ 'TIME': value.next });
      }

    }
  }

  getWmsCaps(loadCaps: boolean = true) {
    if (!loadCaps && this.capabilities) {
      this.findLayerInCaps(this.capabilities);
    } else {
      const parser = new WMSCapabilities();
      fetch(`${this.wmsurl}?service=wms&request=GetCapabilities&version=1.3.0`).then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(`status code: ${response.status}`);
        }
      }).then((text) => {
        this.capabilities = parser.read(text);
        this.findLayerInCaps(this.capabilities);
      }).catch((err) => {
        const snack = this.snackbar.open(`GetCapabilities - ${err}`, 'Close');
        const sub = snack.onAction().subscribe(() => {
          this.progressBarMode = '';
          sub.unsubscribe();
      });
      });
    }
  }

  findLayerInCaps(caps: any) {
    // this.snackbar.open(`caps loaded`, 'Close');
    const Service = caps.Service;
    const Capability = caps.Capability;
    const AllLayer = Capability.Layer;
    // console.log(caps);
    this.dwdinfo.title = Service.Title;
    this.dwdinfo.link = Service.AccessConstraints;
    // -----------------------------------
    // this.weatherlayername.value = 'SF-Produkt'; //FX-Produkt, RX-Produkt, SF-Produkt, SF-Produkt_(0-24)
    // console.log(this.weatherlayername.value);
    const RadarLayer = this.findLayerRecursive(AllLayer, this.weatherlayername.value);
    // console.log(RadarLayer);
    // this.checkDimensionTime(RadarLayer.Dimension[0]);
    // this.datesString = RadarLayer.Dimension[0].values.split(',');
    this.datesString = this.checkDimensionTime(RadarLayer.Dimension[0]);
    this.addLayer(RadarLayer, this.datesString);


    // fix: ExpressionChangedAfterItHasBeenCheckedError
    // setTimeout(() => {
    this.legendurl = RadarLayer.Style[0].LegendURL[0].OnlineResource;
    // })

    this.progressBarMode = '';
  }
  /**
  * check if rage or values
  */
  checkDimensionTime(Dimension) {
    if (Dimension.name === 'time') {
      let values = Dimension.values.split(',');
      if (values.length === 1) { // Split fails - is range
        values = Dimension.values.split('/');
        if (values.length === 1) { // Split fails
          console.log('time Fotmate not known!', values);
        } else {
          return this.generateTimeFromRange(values);
        }
      } else {
        return values;
      }
      console.log(values);
    } else {
      console.log('no time Dimension!', Dimension.name);
    }
  }

  generateTimeFromRange(values: string[]) {
    const start = values[0], end = values[1], duaration = values[2];
    let _values = [];
    _values = this.enumerateDaysBetweenDates(start, end, duaration);
    return _values;
  }

  enumerateDaysBetweenDates(startDate, endDate, duaration) {
    console.log('dates: ', startDate, endDate);
    const dates = [];

    const currDate = moment.utc(startDate);
    const lastDate = moment.utc(endDate);
    const period = moment.duration(duaration).asMilliseconds();

    dates.push(currDate.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z');

    while (currDate.add(period, 'ms').diff(lastDate) <= 0) {
      const formated = currDate.clone().format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
      dates.push(formated);
    }

    console.log('dates', dates);
    return dates;
  }

  getTileGrid(extent) {
    const projExtent = getProjection(this.EPSGCODE).getExtent();
      const startResolution = getWidth(projExtent) / 256;
      const resolutions = new Array(22);
      for (let i = 0, ii = resolutions.length; i < ii; ++i) {
        resolutions[i] = startResolution / Math.pow(2, i);
      }
      return new TileGrid({
        extent: extent,
        resolutions: resolutions,
        tileSize: [512, 256]
      });
  }

  addLayer(Layer, times: string[]) {
    let layersextent = Layer.BoundingBox.filter(item => item.crs === this.EPSGCODE);
    if (!layersextent.length) {
      layersextent = this.fallbackExtent;
    } else {
      layersextent = layersextent[0].extent;
    }
    this.timeSource = new TileWMS({
      attributions: ['copyrigt DWD'],
      url: this.wmsurl,
      params: {
        'LAYERS': `dwd:${Layer.Name}`,
        'VERSION': '1.3.0',
        'CRS': this.view.getProjection(), // Layer.CRS[0]
        'TIME': times[0],
        'TILED': true
      },
      serverType: 'geoserver',
      tileGrid: this.getTileGrid(layersextent)
    });
    /*
        this.timeSource.on('tileloadstart', function() {
          console.log('tileloadstart')
        });

        this.timeSource.on('tileloadend', function() {
          console.log('tileloadend')
        });
        this.timeSource.on('tileloaderror', function() {
          console.log('tileloaderror')
        });
    */

    /*
    this.preloadSource = new TileWMS({
      attributions: ['copyrigt DWD'],
      url: this.wmsurl,
      params: {
        'LAYERS': `dwd:${Layer.Name}`,
        'TIME': times[1],
        'VERSION': '1.3.0',
        'CRS': this.view.getProjection()//Layer.CRS[0]
      }
    })
    */
    /*
        this.preloadSource.on('tileloadstart', function() {
          console.log('pre-tileloadstart')
        });

        this.preloadSource.on('tileloadend', function() {
          console.log('pre-tileloadend')
        });
        this.preloadSource.on('tileloaderror', function() {
          console.log('pre-tileloaderror')
        });
    */

    this.layer = new TileLayer({
      extent: layersextent,
      source: this.timeSource
    });

    // layer.set('title',Layer.Title);
    this.layertitle = Layer.Title;
    // layer.set('description',Layer.Abstract)
    this.layerdescription = Layer.Abstract;
    this.layer.setOpacity(0.7);

    /*
    this.prelayer = new TileLayer({
      //extent: extent,
      source: this.preloadSource
    })
    this.prelayer.setOpacity(0);
    */

    const overlays = this.getOverlays();
    overlays.getLayers().push(this.layer);
    // overlays.getLayers().push(this.prelayer)
  }

  setLayerOpacity(slider: MatSlider) {
    this.layer.setOpacity(slider.value);
  }

  getLayerOpacity(): number {
    return this.layer.getOpacity();
  }

  getOverlays() {
    let layer: LayerGroup;
    this.map.getLayers().forEach((_layer: LayerGroup) => {
      if (_layer.get('name') === 'overlays') {
        layer = _layer;
      }
    });
    return layer;
  }

  // Fachlayer.Wetter.Radar.FX-Produkt
  findLayerRecursive(lLayergroup: any, path: string) {
    const names: Array<string> = path.split('.');
    if (names.length > 0) {
      for (const layer of lLayergroup.Layer) {
        if (layer.Name === names[0]) {
          if (layer.Layer) {
            names.shift();
            const _path = names.join('.');
            return this.findLayerRecursive(layer, _path);
          } else {
            return layer;
          }
        }
      }
    }

  }



}
