import { Component, ViewEncapsulation, OnInit, HostBinding, AfterViewInit, OnDestroy } from '@angular/core';

import { IdateChange } from './time-slider/time-slider.component';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import olView from 'ol/View';
import olMap from 'ol/Map';
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
import { defaults as defaultControls } from 'ol/control/defaults';


import { currentVersionKey, newVersionKey, PwaHelper } from './pwa.helper';
import { DateTime } from 'luxon';
import { WMSCapabilities } from 'ol/format';
import { Icapabilities } from './ogc.types';
import { checkIf5MinutesLater, checkDimensionTime, formatDate, getDatesBetween, addHours, getLocation as getUrlLocation, getSearchParamsFronString, getShareLink } from './utills';
import { addLocationLayer, findLayerRecursive, getLocation, getTileGrid } from './map.utills';
import { ElementRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { LegacyProgressBarMode as ProgressBarMode } from '@angular/material/legacy-progress-bar';
import { ButtonControl } from './ol-custom-control';
import { environment } from './../environments/environment';
import { EventsKey } from 'ol/events';
import { unByKey } from 'ol/Observable';


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
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('class') class = 'app-container';
  @HostBinding("class.open-nav") navOpen = false;

  /** for debugging */
  useCapsFromStore = true;

  swVersion = {
    current: null,
    available: null
  };

  mapSubs: EventsKey[] = [];

  public weatherlayers: IweatherlayerItem[] = [
    // https://www.dwd.de/DE/leistungen/radarprodukte/radarprodukte.html
    // https://www.dwd.de/DE/leistungen/radarprodukte/radarkomposit_wn.html
    { value: 'Fachlayer.Wetter.Radar.WN-Produkt', viewValue: 'Radarvorhersage', startDate: addHours(DateTime.local().toISO(), 2, '-') },
    { value: 'Fachlayer.Wetter.Radar.RADOLAN-RY', viewValue: 'Qualitätsgeprüfte Radardaten (RY)' },
    // https://www.dwd.de/DE/leistungen/radarprodukte/radarkomposit_rv.html
    { value: 'Fachlayer.Wetter.Radar.RV-Produkt', viewValue: 'Akkumulierte Niederschlagsmenge' }, //  akkumulierten Niederschlagsmenge

    { value: 'Fachlayer.Wetter.Mittelfristvorhersagen.GefuehlteTemp', viewValue: 'Gefühlte Temperatur' },
    { value: 'Fachlayer.Wetter.Beobachtungen.RBSN_T2m', viewValue: 'Temperatur 2m' },
    { value: 'Fachlayer.Wetter.Beobachtungen.RBSN_FF', viewValue: 'Windgeschwindigkeit' },
    { value: 'Fachlayer.Wetter.Satellit.Satellite_meteosat_1km_euat_rgb_day_hrv_and_night_ir108_3h', viewValue: 'Satellitenbild METEOSAT' },
    { value: 'Fachlayer.Wetter.Satellit.Satellite_worldmosaic_3km_world_ir108_3h', viewValue: 'Satellitenbild Weltkomposit IR' },

    { value: 'Fachlayer.Wetter.Analysen.NCEW_EU', viewValue: 'Voraussichtliche Blitzeinschläge' },
    { value: 'Fachlayer.Wetter.Kurzfristvorhersagen.Autowarn_Analyse', viewValue: 'Autowarn_Analyse' },
    { value: 'Fachlayer.Wetter.Kurzfristvorhersagen.Autowarn_Vorhersage', viewValue: 'Autowarn_Vorhersage' },
    { value: 'Fachlayer.Wetter.Radar.SF-Produkt', viewValue: 'Radarkomposit 24h-Aufsummierung - alle 60 Minuten' },
    { value: 'Fachlayer.Wetter.Radar.RADOLAN-W4', viewValue: 'Radarkomposit 30 Tage (SF-Produkt) - täglich' }


  ];
  public weatherlayername = new FormControl<string>(this.weatherlayers[0]?.value ?? null);
  public datesString: string[];

  public legendurl = '';
  public layerCapsUrl = '';
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


  map: olMap;
  view: olView;
  EPSGCODE = 'EPSG:3857';
  capabilities: Icapabilities;

  wmsurl = 'https://maps.dwd.de/geoserver/dwd/wms';

  timeSource: TileWMS;
  layer: TileLayer<TileWMS>;
  /** EPSG:3857 */
  fallbackExtent = [183082.1073087257, 5345076.652029778, 2017570.7861529556, 7786169.587345167];
  /** Muenchen */
  public startState = {
    title: 'München',
    center: [1288323.189210665, 6134720.493257317],
    zoom: 9,
    time: null,
    layer: this.weatherlayers[0]?.viewValue
  }

  currentLocation = {
    isLocated: false,
    layer: null
  }

  public currentState: {
    zoom: number,
    center: number[],
    time: string,
    layer: string
  };

  constructor(private elRef: ElementRef, private snackbar: MatSnackBar, private pwaHelper: PwaHelper) {
    if (environment.production) {
      this.useCapsFromStore = false;
    }
    this.currentState = {
      zoom: this.startState.zoom,
      center: this.startState.center,
      time: this.startState.time,
      layer: this.startState.layer
    };
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
        this.findLayerInCaps(this.capabilities, true);
      }
    });
  }

  public shareLink() {
    const link = getShareLink({
      time: this.currentState.time,
      zoom: this.currentState.zoom.toFixed(3),
      center: this.currentState.center.map(i => i.toFixed(3)).join(','),
      layer: this.weatherlayername.value
    });
    this.pwaHelper.shareLink(link);
  }

  updateMapSize() {
    if (this.map) {
      // console.log('update size')
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

  public setLayerOpacity(event) {
    this.layer.setOpacity(parseFloat(event.target.value));
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
      this.currentState.time = time.toISOString();
      this.timeSource.updateParams({ TIME: value.now });

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

  ngOnDestroy(): void {
    this.mapSubs.forEach(s => unByKey(s));
  }

  initMap() {
    this.view = new olView({
      center: this.startState.center,
      zoom: this.startState.zoom,
      projection: this.EPSGCODE
    });

    const baselayer = new TileLayer({
      className: 'baseLayer',
      preload: Infinity,
      source: new XYZ({
        // url: `https://tile.osmand.net/hd/{z}/{x}/{y}.png`
        url: `https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
        attributions: `&#169; <a href="https://www.openstreetmap.org/copyright" target="_blank">OSM</a> & contributors`
      })
    });

    const baselayers = new LayerGroup({
      layers: [baselayer]
    });
    baselayers.set('name', 'baselayers');

    const overlays = new LayerGroup();
    overlays.set('name', 'overlays');

    this.map = new olMap({
      view: this.view,
      layers: [
        baselayers,
        overlays
      ],
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      controls: defaultControls().extend([
        new Attribution({
          collapsed: false
        }),
        new Rotate(),
        new ButtonControl({
          innerHTML: `<span class="material-icons">my_location</span>`,
          className: 'geo-locate-ctrl',
          event: {
            type: 'click', fn: () => {
              if (!this.currentLocation.isLocated) {
                getLocation(this.EPSGCODE, (coordinates => {
                  if (coordinates) {
                    this.currentLocation.layer = addLocationLayer(this.map, coordinates);
                    // this.view.setCenter(coordinates);
                    // this.view.setZoom(18);
                  }
                }));
                this.currentLocation.isLocated = true;
                return true;
              } else {
                // this.view.setZoom(this.currentLocation.lastZoom);
                if (this.currentLocation.layer) {
                  this.map.removeLayer(this.currentLocation.layer);
                }
                this.currentLocation.isLocated = false;
                return true;
              }

            }
          }
        })
      ]),
      target: 'map'
    });


    /* const mapOnClick = this.map.on('click', (evt) => {
      const zoom = this.map.getView().getZoom();
      const center = this.map.getView().getCenter();
      const extent = this.map.getView().calculateExtent(this.map.getSize());
      // console.log(zoom, center, extent);
    });
    this.mapSubs.push(mapOnClick); */

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


  findLayerInCaps(caps: Icapabilities, refresh = false) {
    // this.snackbar.open(`caps loaded`, 'Close');
    // console.log(caps)
    const allLayers = caps?.Capability?.Layer ?? null;
    this.dwdinfo.title = caps?.Service?.Title ?? 'NoTitle';
    this.dwdinfo.link = caps?.Service?.AccessConstraints ?? null;
    //--------------------------------
    if (!refresh) {
      const { search } = getUrlLocation();
      const query = getSearchParamsFronString(search);
      const layerViewValue = query.get('layer');
      if (layerViewValue) {
        this.weatherlayername.setValue(layerViewValue)
      }

      const time = query.get('time');
      const center = query.get('center');
      const zoom = query.get('zoom');

      if (time) {
        this.currentState.time = time;
      }
      if (center) {
        this.currentState.center = center.split(',').map(i => parseFloat(i));
      }
      if (zoom) {
        this.currentState.zoom = parseFloat(zoom);
      }
    }

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
      if ('Dimension' in layer) {
        const allDates = checkDimensionTime(layer.Dimension[0]);
        if (layerConfig && (layerConfig.startDate || layerConfig.endDate)) {
          this.datesString = getDatesBetween(allDates, layerConfig.startDate, layerConfig.endDate);
        } else {
          this.datesString = allDates;
        }
      } else {
        this.snackbar.open(`Layer without Time Dimension`, 'Close');
      }

      // here timeslider is finds the start date -> findClosestDate()
      this.startState.time = this.datesString[0];

      if (!refresh) {
        const startTimeIndex = this.datesString.indexOf(this.currentState.time);
        if (startTimeIndex !== -1) {
          // here timeslider uses this date if existing
          this.startState.time = this.datesString[startTimeIndex];
        }

        if (this.currentState.time && startTimeIndex === -1) {
          this.snackbar.open(`Time ${this.currentState.time} not found, the default time is used!`, 'Close');
        }
      }

      this.addLayer(layer, this.startState.time, { zoom: this.currentState.zoom, center: this.currentState.center });

      if ('Style' in layer) {
        this.legendurl = layer.Style[0].LegendURL[0].OnlineResource;
      }

      this.layerCapsUrl = `${this.wmsurl}?service=WMS&version=1.3.0&request=GetCapabilities&searchForLayer=${layer.Name}`
      console.log(layer)

    } else {
      // console.log(caps);
      this.snackbar.open(`Layer ${this.weatherlayername.value} not found!`, 'Close');
    }
  }

  addLayer(Layer, startTime: string, zoomCenter: { zoom?: number, center?: number[] }) {
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
        TIME: startTime,
        TILED: true
      },
      serverType: 'geoserver',
      tileGrid: getTileGrid(layersextent, this.EPSGCODE)
    });

    this.layer = new TileLayer({
      extent: layersextent,
      source: this.timeSource
    });

    // layer.set('title',Layer.Title);
    this.layertitle = Layer.Title;
    // layer.set('description',Layer.Abstract)
    this.layerdescription = Layer.Abstract;
    this.layer.setOpacity(0.7);

    const overlays = this.getOverlays();
    overlays.getLayers().push(this.layer);


    if (zoomCenter.zoom) {
      this.view.setZoom(zoomCenter.zoom);
    }
    if (zoomCenter.center) {
      this.view.setCenter(zoomCenter.center);
    }

    const mapOnMove = this.map.on('moveend', (evt) => {
      this.currentState.center = this.map.getView().getCenter();
      this.currentState.zoom = this.map.getView().getZoom();
    });
    this.mapSubs.push(mapOnMove);
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
