import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import * as ol from 'openlayers';

@Component({
  selector: 'app-root',
  templateUrl: 'app.template.html',
  styleUrls: ['app.style.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  title = 'app';
  map: ol.Map;

  constructor() {

  }

  ngAfterViewInit() {
    this.map = new ol.Map({
      view: new ol.View({
        center: [0, 0],
        zoom: 1
      }),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      controls: [],
      target: 'map'
    });

    this.map.on('moveend',(evt:ol.MapEvent)=>{
      let view = evt.map.getView();
      let zoom = view.getZoom();
      let center = view.getCenter();
      console.log(center,zoom)
    })
  }

  /** [x:number, y:number] */
  setCenter(center:[number,number]){
    this.map.getView().setCenter(center)
  }

  zoom(value: '-'|'+'){
    let zoomControll:any = new ol.control.Zoom();
    zoomControll.getMap = ()=>{return this.map}
    //this.map.addControl(zoomControll)
    let delta = (value == '-')? -1: 1;
    zoomControll.zoomByDelta_(delta);
  }
}
