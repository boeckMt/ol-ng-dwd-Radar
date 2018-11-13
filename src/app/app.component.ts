import { Component, OnInit, AfterViewInit, ViewEncapsulation, EventEmitter } from '@angular/core';
//import * as ol from 'openlayers';
import { IdateChange } from './time-slider/time-slider.component';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MatSlider } from '@angular/material';

import View from 'ol/View';
import { transform } from 'ol/proj.js';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import LayerGroup from 'ol/layer/Group';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import TileWMS from 'ol/source/TileWMS';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  map: Map;
  view: View;

  mapState: { center: [number, number], zoom: number };
  wmsurl: string;
  weatherlayers: any[];
  weatherlayername: FormControl;
  timeSource: TileWMS;
  layer: TileLayer;
  preloadSource: TileWMS;
  prelayer: TileLayer;

  datesString: string[];
  slidervalue: string;

  legendurl: any;
  progressBarMode: 'indeterminate' | '' = 'indeterminate';
  legend: boolean;

  layertitle: string = 'DWD Radar';
  layerdescription: string = '';
  dwdinfo: {
    link: string,
    title: string
  };

  constructor() {
    this.weatherlayers = [
      { value: 'Fachlayer.Wetter.Radar.FX-Produkt', viewValue: 'Radarvorhersage' },
      { value: 'Fachlayer.Wetter.Mittelfristvorhersagen.GefuehlteTemp', viewValue: 'Gefühlte Temperatur' },
      { value: 'Fachlayer.Wetter.Beobachtungen.RBSN_T2m', viewValue: 'Temperatur 2m' },
      { value: 'Fachlayer.Wetter.Satellit.SAT_EU_central_RGB_cloud', viewValue: 'Satellitenbild' }

      
    ];

    this.weatherlayername = new FormControl(this.weatherlayers[0].value);
    this.wmsurl = 'https://maps.dwd.de/geoserver/dwd/wms';
    this.legend = false;
    this.legendurl = '';
    this.dwdinfo = { link: null, title: null };
    //this.datesString = [];

  }

  ngOnInit() {

  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (this.checkIfLocationInGermany()) {
          this.map.setView(new View({
            center: transform([position.coords.longitude, position.coords.latitude], 'EPSG:4326', 'EPSG:3857'),
            zoom: 7
          }));
        }
      });
    }
  }

  //TODO
  checkIfLocationInGermany() {
    return true;
  }

  isLoading() {
    return this.progressBarMode == 'indeterminate';
  }

  refresh() {
    this.afterInit();
  }

  showLegend() {
    this.legend = !this.legend;
  }

  produktChange(value) {
    this.refresh();
  }

  ngAfterViewInit() {
    /*
        var RadolanProjection = new Projection({
          code: 'EPSG:1000001',
          units: 'm'
        });
    */

    this.view = new View({
      center: [1130473.1421064818, 6644817.811938905],
      //center: transform([1130473.1421064818, 6644817.811938905], 'EPSG:3857', 'EPSG:4326'),
      zoom: 6,
    });

    var baselayer = new TileLayer({
      preload: Infinity,
      source: new OSM()
    })

    var baselayers = new LayerGroup({
      name: 'baselayers',
      layers: [baselayer]
    })

    var overlays = new LayerGroup({
      name: 'overlays'
    })


    this.map = new Map({
      view: this.view,
      layers: [
        baselayers,
        overlays
      ],
      controls: [],
      target: 'map'
    });

    this.getLocation();

    this.afterInit();
  }

  afterInit() {
    this.progressBarMode = 'indeterminate';
    this.view.setRotation(0);
    var overlays = this.getOverlays();
    overlays.getLayers().clear();
    this.getWmsCaps();
  }


  sliderOnChange(value: IdateChange) {
    //console.log(value.last, value.now, value.next)
    if (this.timeSource && this.timeSource.updateParams) {

      var time = new Date(value.now)

      //console.log(time.toISOString())
      this.slidervalue = time.toISOString();
      this.timeSource.updateParams({ 'TIME': value.now });

      if (value.next) {
        let preloadtime = new Date(value.next);
        //console.log(preloadtime.toISOString())
        //this.preloadSource.updateParams({ 'TIME': value.next });
      }

    }
  }

  getWmsCaps() {
    var parser = new WMSCapabilities();
    fetch(`${this.wmsurl}?service=wms&request=GetCapabilities&version=1.3.0`).then((response) => {
      return response.text();
    }).then((text) => {
      var result: any = parser.read(text);
      this.findLayerInCaps(result);
    });
  }

  findLayerInCaps(caps: any) {
    var Service = caps.Service
    var Capability = caps.Capability
    var AllLayer = Capability.Layer
    console.log(caps)
    this.dwdinfo.title = Service.Title;
    this.dwdinfo.link = Service.AccessConstraints;
    //-----------------------------------
    //this.weatherlayername.value = 'SF-Produkt'; //FX-Produkt, RX-Produkt, SF-Produkt, SF-Produkt_(0-24)
    console.log(this.weatherlayername.value);
    var RadarLayer = this.findLayerRecursive(AllLayer, this.weatherlayername.value);
    console.log(RadarLayer)
    //this.checkDimensionTime(RadarLayer.Dimension[0]);
    //this.datesString = RadarLayer.Dimension[0].values.split(',');
    this.datesString = this.checkDimensionTime(RadarLayer.Dimension[0]);
    this.addLayer(RadarLayer, this.datesString);


    //fix: ExpressionChangedAfterItHasBeenCheckedError
    //setTimeout(() => {
    this.legendurl = RadarLayer.Style[0].LegendURL[0].OnlineResource
    //})

    this.progressBarMode = '';
  }
  /**
  * check if rage or values
  */
  checkDimensionTime(Dimension) {
    if (Dimension.name == 'time') {
      let values = Dimension.values.split(',');
      if (values.length == 1) { //Split fails - is range
        values = Dimension.values.split('/');
        if (values.length == 1) { //Split fails
          console.log('time Fotmate not known!', values);
        } else {
          return this.generateTimeFromRange(values);
        }
      } else {
        return values;
      }
      console.log(values)
    } else {
      console.log('no time Dimension!', Dimension.name)
    }
  }

  generateTimeFromRange(values: string[]) {
    let start = values[0], end = values[1], duaration = values[2];
    let _values = [];
    _values = this.enumerateDaysBetweenDates(start, end, duaration);
    return _values;
  }

  enumerateDaysBetweenDates(startDate, endDate, duaration) {
    console.log('dates: ',startDate, endDate)
    let dates = [];

    let currDate = moment.utc(startDate); //.startOf('day');
    let lastDate = moment.utc(endDate); //.startOf('day');
    let period = moment.duration(duaration).asMilliseconds();

    dates.push(currDate.format('YYYY-MM-DDTHH:mm:ss.SSS')+'Z')

    while (currDate.add(period,'ms').diff(lastDate) <= 0) {
      let formated = currDate.clone().format('YYYY-MM-DDTHH:mm:ss.SSS')+'Z';
      dates.push(formated);
    }

    console.log('dates', dates)
    return dates;
  }

  addLayer(Layer, times: string[]) {
    //console.log(Layer)
    this.timeSource = new TileWMS({
      attributions: ['copyrigt DWD'],
      url: this.wmsurl,
      params: {
        'LAYERS': `dwd:${Layer.Name}`,
        'VERSION': '1.3.0',
        'CRS': this.view.getProjection(),//Layer.CRS[0]
        'TIME': times[0]
      }
    })
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
      //extent: extent,
      source: this.timeSource
    })

    //layer.set('title',Layer.Title);
    this.layertitle = Layer.Title;
    //layer.set('description',Layer.Abstract)
    this.layerdescription = Layer.Abstract;
    this.layer.setOpacity(0.7);

    /*
    this.prelayer = new TileLayer({
      //extent: extent,
      source: this.preloadSource
    })
    this.prelayer.setOpacity(0);
    */

    var overlays = this.getOverlays();
    overlays.getLayers().push(this.layer)
    //overlays.getLayers().push(this.prelayer)
  }

  setLayerOpacity(slider:MatSlider){
    this.layer.setOpacity(slider.value);
  }

  getLayerOpacity():number{
    return this.layer.getOpacity();
  }

  getOverlays() {
    var layer: LayerGroup;
    this.map.getLayers().forEach((_layer: LayerGroup) => {
      if (_layer.get('name') == 'overlays') {
        layer = _layer;
      }
    })
    return layer;
  }

  //Fachlayer.Wetter.Radar.FX-Produkt
  findLayerRecursive(LayerGroup: any, path: string) {
    var names: Array<string> = path.split('.')
    if (names.length > 0) {
      for (let layer of LayerGroup.Layer) {
        if (layer.Name == names[0]) {
          if (layer.Layer) {
            names.shift();
            let _path = names.join('.');
            return this.findLayerRecursive(layer, _path);
          } else {
            return layer;
          }
        }
      }
    }

  }



}
