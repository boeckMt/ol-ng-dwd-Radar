import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import * as ol from 'openlayers';
import { MapstateService } from './mapstate.service';
import { BehaviorSubject } from 'rxjs'
import { IdateChange } from './slider/slider.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.template.html',
  styleUrls: ['app.style.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  title = 'app';
  map: ol.Map;
  view: ol.View;

  mapState: { center: [number, number], zoom: number };
  wmsurl: string;
  timeSource: ol.source.TileWMS;
  preloadSource: ol.source.TileWMS;

  datesString: string[];
  slidervalue: string;

  legendurl: any;
  animationId: any;

  constructor(private mapSvc: MapstateService) {
    console.log(mapSvc)
    this.wmsurl = 'https://maps.dwd.de/geoserver/dwd/wms';

    //this.datesString = [];

  }

  ngOnInit() {
    this.mapSvc.getState().subscribe((state) => {
      this.mapState = state;
    })

    this.legendurl = this.getLegendForWms();
  }

  ngAfterViewInit() {
    /*
        var RadolanProjection = new ol.proj.Projection({
          code: 'EPSG:1000001',
          units: 'm'
        });
    */

    this.view = new ol.View({
      center: [1130473.1421064818, 6644817.811938905],
      //center: ol.proj.transform([1130473.1421064818, 6644817.811938905], 'EPSG:3857', 'EPSG:4326'),
      zoom: 6,
      //projection: "EPSG:4326" //RadolanProjection
    });

    var baselayer = new ol.layer.Tile({
      preload: Infinity,
      source: new ol.source.OSM()
    })

    /*
        var baselayer = new ol.layer.Tile({
          source: new ol.source.TileWMS({
            attributions: ['copyrigt DWD'],
            url: this.wmsurl,
            params: {
              'LAYERS': `GRAY_HR_SR_OB_DR`,
              'VERSION': '1.3.0',
            }
          })
        })
    */

    this.map = new ol.Map({
      view: this.view,
      layers: [
        baselayer
      ],
      controls: [],
      target: 'map'
    });

    this.map.on('moveend', (evt: ol.MapEvent) => {
      let view = evt.map.getView();
      let zoom = view.getZoom();
      let center = view.getCenter();
      //console.log(center, zoom)

      this.mapSvc.setState({ center: center, zoom: zoom })
    })

    this.getWmsCaps();
  }

  /** [x:number, y:number] */
  setCenter(center: [number, number]) {
    this.map.getView().setCenter(center)
  }


  setZoom(evt) {
    //console.log(evt)
    var view = this.map.getView();
    this.mapSvc.setState({ center: view.getCenter(), zoom: evt })
  }

  zoom(value: '-' | '+') {
    let zoomControll: any = new ol.control.Zoom();
    zoomControll.getMap = () => { return this.map }
    //this.map.addControl(zoomControll)
    let delta = (value == '-') ? -1 : 1;
    zoomControll.zoomByDelta_(delta);
    var view = this.map.getView();
    this.mapSvc.setState({ center: view.getCenter(), zoom: view.getZoom() })
  }

  getLegendForWms() {
    var value: any = false;
    if (this.timeSource && this.timeSource.getUrls) {
      value = `${this.timeSource.getUrls()[0]}?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${this.timeSource.getParams()['LAYERS']}`
    }
    return value;
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
        this.preloadSource.updateParams({ 'TIME': value.next });
      }

    }
  }

  getWmsCaps() {
    var parser = new ol.format.WMSCapabilities();
    fetch(`${this.wmsurl}?service=wms&request=GetCapabilities&version=1.3.0`).then((response) => {
      return response.text();
    }).then((text) => {
      var result: any = parser.read(text);

      this.findLayerInCaps(result, 'dwd:FX-Produkt');
    });
  }

  findLayerInCaps(caps: any, layername) {
    var Service = caps.Service
    var Capability = caps.Capability
    var AllLayer = Capability.Layer
    console.log(AllLayer)
    //-----------------------------------
    var RadarLayer = this.findLayerRecursive(AllLayer, 'Fachlayer.Wetter.Radar.FX-Produkt');
    console.log(RadarLayer);
    this.datesString = RadarLayer.Dimension[0].values.split(',');
    console.log(this.datesString)

    this.addLayer(RadarLayer, this.datesString);


    //fix: ExpressionChangedAfterItHasBeenCheckedError
    //setTimeout(() => {
    //this.legendurl = this.getLegendForWms()
    //})
  }

  addLayer(Layer, times: string[]) {
    this.timeSource = new ol.source.TileWMS({
      attributions: ['copyrigt DWD'],
      url: this.wmsurl,
      params: {
        'LAYERS': `dwd:${Layer.Name}`,
        'VERSION': '1.3.0',
        'CRS': this.view.getProjection(),//Layer.CRS[0]
        'TIME': times[0]
      }
      /**
      * FX-Produkt
      * 2 stündige Radarvorhersage auf Basis des RX-Produktes - experimenteller Status (Dez 2014)
      * <Dimension name="time" default="current" units="ISO8601">2018-01-02T14:05:00.000Z,2018-01-02T14:10:00.000Z,2018-01-02T14:15:00.000Z,...</Dimension>
      */

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


    this.preloadSource = new ol.source.TileWMS({
      attributions: ['copyrigt DWD'],
      url: this.wmsurl,
      params: {
        'LAYERS': `dwd:${Layer.Name}`,
        'TIME': times[1],
        'VERSION': '1.3.0',
        'CRS': this.view.getProjection()//Layer.CRS[0]
      }
    })
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

    var layer = new ol.layer.Tile({
      //extent: extent,
      source: this.timeSource
    })
    layer.setOpacity(0.7);

    var prelayer = new ol.layer.Tile({
      //extent: extent,
      source: this.preloadSource
    })
    prelayer.setOpacity(0);

    this.map.addLayer(layer);
    this.map.addLayer(prelayer);
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
