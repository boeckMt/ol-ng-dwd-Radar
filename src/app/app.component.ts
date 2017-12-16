import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import * as ol from 'openlayers';
import { MapstateService } from './mapstate.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.template.html',
  styleUrls: ['app.style.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  title = 'app';
  map: ol.Map;

  mapState: {center:[number,number], zoom:number};

  constructor(private mapSvc:MapstateService) {
    console.log(mapSvc)
  }

  ngOnInit(){
    this.mapSvc.getState().subscribe((state)=>{
      this.mapState = state;
    })
    
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

      this.mapSvc.setState({center:center, zoom:zoom})
    })
  }

  /** [x:number, y:number] */
  setCenter(center:[number,number]){
    this.map.getView().setCenter(center)
  }


  setZoom(evt){
    console.log(evt)
    var view = this.map.getView();
    this.mapSvc.setState({center:view.getCenter(), zoom:evt})
  }

  zoom(value: '-'|'+'){
    let zoomControll:any = new ol.control.Zoom();
    zoomControll.getMap = ()=>{return this.map}
    //this.map.addControl(zoomControll)
    let delta = (value == '-')? -1: 1;
    zoomControll.zoomByDelta_(delta);
    var view = this.map.getView();
    this.mapSvc.setState({center:view.getCenter(), zoom:view.getZoom()})
  }

}
