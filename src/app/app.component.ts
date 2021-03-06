import { Component, ViewEncapsulation, OnInit, HostBinding, AfterViewInit } from '@angular/core';

import { IdateChange } from './time-slider/time-slider.component';
import { FormControl } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';

import View from 'ol/View';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import LayerGroup from 'ol/layer/Group';
import TileWMS from 'ol/source/TileWMS';
import Attribution from 'ol/control/Attribution';
import Rotate from 'ol/control/Rotate';
import {
  DragRotateAndZoom,
  defaults as defaultInteractions
} from 'ol/interaction'


import { currentVersionKey, newVersionKey, PwaHelper } from './pwa.helper';
import { DateTime } from 'luxon';
import { WMSCapabilities } from 'ol/format';
import { Icapabilities } from './ogc.types';
import { checkIf5MinutesLater, checkDimensionTime, formatDate, getDatesBetween, addHours } from './utills';
import { findLayerRecursive, getLocation, getTileGrid } from './map.utills';
import { ElementRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { ButtonControl } from './ol-custom-control';
import { environment } from './../environments/environment';


export interface IProgress {
  mode: ProgressBarMode;
  color: ThemePalette | 'debug';
}

export interface IweatherlayerItem {
  value: string;
  viewValue: string;
  startDate?: string;
  endDate?: string;
}


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {
  @HostBinding('class') class = 'app-container';
  @HostBinding("class.open-nav") navOpen = false;

  /** for debugging */
  useCapsFromStore = true;

  swVersion = {
    current: null,
    available: null
  };

  public weatherlayers: IweatherlayerItem[] = [
    // { value: 'Fachlayer.Wetter.Radar.FX-Produkt', viewValue: 'Radarvorhersage' },
    { value: 'Fachlayer.Wetter.Radar.WN-Produkt', viewValue: 'Radarvorhersage', startDate: addHours(DateTime.local().toISO(), 2, '-') },

    { value: 'Fachlayer.Wetter.Kurzfristvorhersagen.WAWFOR_ieu_temperature_2m', viewValue: 'WAWFOR_ieu_temperature_2m' },
    { value: 'Fachlayer.Wetter.Kurzfristvorhersagen.WAWFOR_ieu_qff', viewValue: 'WAWFOR_ieu_qff' },


    { value: 'Fachlayer.Wetter.Mittelfristvorhersagen.GefuehlteTemp', viewValue: 'Gefühlte Temperatur' },
    { value: 'Fachlayer.Wetter.Beobachtungen.RBSN_T2m', viewValue: 'Temperatur 2m' },
    { value: 'Fachlayer.Wetter.Beobachtungen.RBSN_FF', viewValue: 'Windgeschwindigkeit' },
    { value: 'Fachlayer.Wetter.Satellit.SAT_EU_central_RGB_cloud', viewValue: 'Satellitenbild' }
  ];
  public weatherlayername = new FormControl(this.weatherlayers[0]?.value ?? null);

  public datesString: string[];
  public slidervalue: string;

  public legendurl = '';
  public progressBar: IProgress = {
    mode: 'indeterminate',
    color: 'primary'
  };

  public layertitle = 'DWD Radar';
  public layerdescription = '';
  public dwdinfo: {
    link: string,
    title: string
  } = { link: null, title: null };


  map: Map;
  view: View;
  EPSGCODE = 'EPSG:3857';
  capabilities: Icapabilities;

  wmsurl = 'https://maps.dwd.de/geoserver/dwd/wms';

  timeSource: TileWMS;
  layer: TileLayer;
  /** EPSG:3857 */
  fallbackExtent = [183082.1073087257, 5345076.652029778, 2017570.7861529556, 7786169.587345167];
  /** Muenchen */
  startLocation = {
    title: 'München',
    center: [1288323.189210665, 6134720.493257317],
    zoom: 9
  }
  // preloadSource: TileWMS;
  // prelayer: TileLayer;

  constructor(private elRef: ElementRef, private snackbar: MatSnackBar, private pwaHelper: PwaHelper) {
    if (environment.production) {
      this.useCapsFromStore = false;
    }
  }

  public formatDate = formatDate;

  public isLoading() {
    return this.progressBar.mode === 'indeterminate';
  }

  public refresh() {
    this.afterInit().then((caps) => {
      if (caps && 'version' in caps) {
        this.capabilities = caps;
        // console.log(caps)
        this.findLayerInCaps(this.capabilities);
      }
    });
  }

  updateMapSize() {
    if (this.map) {
      console.log('update size')
      setTimeout(() => {
        this.map.updateSize();
      }, 200);
    }
  }


  public showDetails() {
    if (this.navOpen && this.elRef.nativeElement) {
      this.elRef.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.navOpen = !this.navOpen;
    this.updateMapSize();
  }

  public produktChange() {
    this.refresh();
  }

  public setLayerOpacity(slider: MatSlider) {
    this.layer.setOpacity(slider.value);
  }

  public getLayerOpacity(): number {
    if (!this.layer) {
      return 0;
    }
    return this.layer.getOpacity();
  }

  public sliderOnChange(value: IdateChange) {
    // console.log(value.last, value.now, value.next)
    if (this.timeSource && this.timeSource.updateParams) {

      const time = new Date(value.now);

      // console.log(time.toISOString())
      this.slidervalue = time.toISOString();
      this.timeSource.updateParams({ TIME: value.now });

      if (value.next) {
        const preloadtime = new Date(value.next);
        // console.log(preloadtime.toISOString())
        // this.preloadSource.updateParams({ 'TIME': value.next });
      }
    }
  }

  ngOnInit() {
    // this.pwaHelper.checkUpdates(); this is already done pwaHelpers constructor
    this.pwaHelper.showInstall();
    this.initMap();
    if (localStorage) {
      this.swVersion.available = localStorage.getItem(newVersionKey);
      this.swVersion.current = localStorage.getItem(currentVersionKey);
    }
  }

  ngAfterViewInit() {
    this.updateMapSize();
  }

  initMap() {
    this.view = new View({
      center: this.startLocation.center,
      zoom: this.startLocation.zoom,
      projection: this.EPSGCODE
    });

    const baselayer = new TileLayer({
      className: 'baseLayer',
      preload: Infinity,
      source: new XYZ({
        // url: `https://tile.osmand.net/hd/{z}/{x}/{y}.png`
        url: `https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png`
      })
    });

    const baselayers = new LayerGroup({
      layers: [baselayer]
    });
    baselayers.set('name', 'baselayers');

    const overlays = new LayerGroup();
    overlays.set('name', 'overlays');

    this.map = new Map({
      view: this.view,
      layers: [
        baselayers,
        overlays
      ],
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      controls: [new Attribution({
        collapsed: false
      }),
      new Rotate(),
      new ButtonControl({
        innerHTML: `<span class="material-icons">my_location</span>`,
        className: 'geo-locate-ctrl',
        event: {
          type: 'click', fn: () => {
            getLocation(this.map, this.EPSGCODE);
          }
        }
      })
      ],
      target: 'map'
    });


    this.map.on('click', (evt) => {
      const zoom = this.map.getView().getZoom();
      const center = this.map.getView().getCenter();
      const extent = this.map.getView().calculateExtent(this.map.getSize());
      // console.log(zoom, center, extent);
    });


    this.afterInit().then((caps) => {
      if (caps && 'version' in caps) {
        this.capabilities = caps;
        this.findLayerInCaps(this.capabilities);
      }
    });
    // this.progressBar.mode = null;
  }

  async afterInit() {
    this.view.setRotation(0);
    const overlays = this.getOverlays();
    overlays.getLayers().clear();
    return this.getWmsCaps().then((caps) => {
      return caps;
    }).catch((err) => {
      this.progressBar.mode = null;
      const snack = this.snackbar.open(`GetCapabilities - ${err}`, 'Close');
      const sub = snack.onAction().subscribe(() => {
        sub.unsubscribe();
      });
      return;
    });
  }

  async getWmsCaps() {
    this.progressBar.mode = 'indeterminate';
    const localCaps = window.localStorage.getItem('lastLocalCpas');

    // for debugging
    if (this.useCapsFromStore && localCaps) {
      if (!this.capabilities) {
        this.capabilities = JSON.parse(localCaps) as Icapabilities;
      }

      this.progressBar.color = 'debug';
      // console.log('cache caps', this.capabilities);
      return new Promise<Icapabilities>((resolve, reject) => {
        setTimeout(() => {
          this.progressBar.mode = null;
          resolve(this.capabilities);
        }, 1000);
      });

    } else {
      window.localStorage.removeItem('lastLocalCpas');
      const cpasLoadTime = window.localStorage.getItem('cpasLoadTime');
      if (!checkIf5MinutesLater(DateTime.fromISO(cpasLoadTime)) && this.capabilities) {
        this.progressBar.color = 'accent';
        // console.log('cache caps', this.capabilities);
        return new Promise<Icapabilities>((resolve, reject) => {
          setTimeout(() => {
            this.progressBar.mode = null;
            resolve(this.capabilities);
          }, 500);
        });
      } else {
        this.progressBar.color = 'primary';
        const parser = new WMSCapabilities();
        return fetch(`${this.wmsurl}?service=wms&request=GetCapabilities&version=1.3.0`).then(async response => {
          if (response.ok) {
            window.localStorage.setItem('cpasLoadTime', DateTime.local().toISO());
            const data = await response.text();
            // console.log('fresh caps');
            this.progressBar.mode = null;
            const caps = parser.read(data) as Icapabilities;
            if (this.useCapsFromStore) {
              window.localStorage.setItem('lastLocalCpas', JSON.stringify(caps));
            }
            return caps;
          } else {
            throw new Error(`status code: ${response.status}`);
          }
        });
      }
    }
  }


  findLayerInCaps(caps: Icapabilities) {
    // this.snackbar.open(`caps loaded`, 'Close');
    const allLayers = caps?.Capability?.Layer ?? null;
    this.dwdinfo.title = caps?.Service?.Title ?? 'NoTitle';
    this.dwdinfo.link = caps?.Service?.AccessConstraints ?? null;
    // -----------------------------------
    // this.weatherlayername.value = 'SF-Produkt'; //FX-Produkt, RX-Produkt, SF-Produkt, SF-Produkt_(0-24)
    // console.log(this.weatherlayername.value);
    const layer = findLayerRecursive(allLayers, this.weatherlayername.value);
    if (layer) {
      // console.log(RadarLayer);
      // this.checkDimensionTime(RadarLayer.Dimension[0]);
      // this.datesString = RadarLayer.Dimension[0].values.split(',');
      const layerConfig = this.weatherlayers.find(l => l.value === this.weatherlayername.value);
      // console.log(layerConfig)
      const allDates = checkDimensionTime(layer.Dimension[0]);
      if (layerConfig && (layerConfig.startDate || layerConfig.endDate)) {
        this.datesString = getDatesBetween(allDates, layerConfig.startDate, layerConfig.endDate);
      } else {
        this.datesString = allDates;
      }

      this.addLayer(layer, this.datesString);


      // fix: ExpressionChangedAfterItHasBeenCheckedError
      // setTimeout(() => {
      this.legendurl = layer.Style[0].LegendURL[0].OnlineResource;
      // })
    } else {
      console.log(caps);
      this.snackbar.open(`Layer ${this.weatherlayername.value} not found!`, 'Close');
    }
  }

  addLayer(Layer, times: string[]) {
    let layersextent = Layer.BoundingBox.filter(item => item.crs === this.EPSGCODE);
    if (!layersextent.length) {
      layersextent = this.fallbackExtent;
    } else {
      layersextent = layersextent[0].extent;
    }
    this.timeSource = new TileWMS({
      attributions: ['&copy; <a href="https://www.dwd.de/DE/service/copyright/copyright_node.html" target="_blank">DWD</a>'],
      url: this.wmsurl,
      params: {
        LAYERS: `dwd:${Layer.Name}`,
        VERSION: '1.3.0',
        CRS: this.view.getProjection(), // Layer.CRS[0]
        TIME: times[0],
        TILED: true
      },
      serverType: 'geoserver',
      tileGrid: getTileGrid(layersextent, this.EPSGCODE)
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

  getOverlays() {
    let layer: LayerGroup;
    this.map.getLayers().forEach((_layer: LayerGroup) => {
      if (_layer.get('name') === 'overlays') {
        layer = _layer;
      }
    });
    return layer;
  }

}
