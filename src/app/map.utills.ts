import TileGrid from 'ol/tilegrid/TileGrid';
import { getWidth } from 'ol/extent';
import { get as getProjection } from 'ol/proj';

import { Layer, LayerEntity } from './ogc.types';

import { transform } from 'ol/proj.js';
import { GPX, GeoJSON } from 'ol/format';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import PointGeom from 'ol/geom/Point';
import LineGeom from 'ol/geom/LineString';
import VectorSource from 'ol/source/Vector';
import { Coordinate } from 'ol/coordinate';
import { Feature, MapBrowserEvent, Overlay } from 'ol';
import CircleStyle from 'ol/style/Circle';
import { Fill, Style, Stroke, Circle } from 'ol/style';
import TileWMS from 'ol/source/TileWMS';
import { IPlaceItem } from './data.utills';


export function findLayerRecursive(lLayergroup: Layer | LayerEntity, path: string) {
  if (!lLayergroup || !path || path.length === 0) {
    return null;
  }
  const names: Array<string> = path.split('.');
  if (names.length > 0) {
    for (const layer of lLayergroup.Layer) {
      if (layer.Name === names[0]) {
        if (layer.Layer && names.length > 1) {
          names.shift();
          const layerPath = names.join('.');
          return findLayerRecursive(layer, layerPath);
        } else {
          return layer;
        }
      }
    }
  }

}

export function getTileGrid(extent, EPSG) {
  const projExtent = getProjection(EPSG).getExtent();
  const startResolution = getWidth(projExtent) / 256;
  const resolutions = new Array(22);
  for (let i = 0, ii = resolutions.length; i < ii; ++i) {
    resolutions[i] = startResolution / Math.pow(2, i);
  }
  return new TileGrid({
    extent,
    resolutions,
    tileSize: [512, 256]
  });
}

export function getLocation(EPSGCODE, cb: (coordinates?: Coordinate) => void) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const coordinates = transform([position.coords.longitude, position.coords.latitude], 'EPSG:4326', EPSGCODE);
      cb(coordinates);
    });
  }
}

export function addLocationLayer(map: Map, coordinates: Coordinate) {
  const locationPont = new VectorLayer<VectorSource<PointGeom>>({
    source: new VectorSource({
      features: [
        new Feature({
          geometry: new PointGeom(coordinates)
        })
      ]
    }),
    style: () => {
      return [
        new Style({
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({
              // color: 'rgba(0, 77, 64, 0.8)
              color: 'rgba(256, 256, 256, 0.3)'
            })
          })
        }),
        new Style({
          image: new CircleStyle({
            radius: 7,
            /* stroke: new Stroke({
              color: 'rgba(256, 256, 256, 0.8)',
              width: 2,
            }), */
            fill: new Fill({
              //color: 'rgba(235, 156, 70, 0.8)'
              color: 'rgba(0, 0, 0, 0.5)'
            })
          })
        })
      ]
    }
  })
  map.addLayer(locationPont);
  return locationPont;
}

/**
 * 
 * @param data GPX or GeoJSON
 */
export function addFileLayer(map: Map, data: string, remove?: boolean) {
  const mapLayers = map.getAllLayers().filter(l => l.get('id')?.includes('FileLayer'));

  if (remove) {
    mapLayers.forEach(l => {
      map.removeLayer(l);
    })

    return;
  }

  let features = [];
  const styles = {};
  const white = [255, 255, 255, 1];
  const blue = [0, 153, 255, 1];
  const width = 3;
  styles['Polygon'] = [
    new Style({
      fill: new Fill({
        color: [255, 255, 255, 0.5],
      })
    })
  ];

  styles['MultiPolygon'] = styles['Polygon'];
  styles['LineString'] = [
    new Style({
      stroke: new Stroke({
        color: white,
        width: width + 2,
      }),
    }),
    new Style({
      stroke: new Stroke({
        color: blue,
        width: width,
      }),
    }),
  ];
  styles['MultiLineString'] = styles['LineString'];

  styles['Circle'] = styles['Polygon'].concat(
    styles['LineString']
  );

  styles['Point'] = [
    new Style({
      image: new Circle({
        radius: width * 2,
        fill: new Fill({
          color: blue,
        }),
        stroke: new Stroke({
          color: white,
          width: width / 2,
        }),
      }),
      zIndex: Infinity,
    })
  ];
  styles['MultiPoint'] = styles['Point'];
  styles['GeometryCollection'] = styles['Polygon'].concat(styles['LineString'], styles['Point']);

  const isGpx = data.indexOf('<?xml') === 0;
  const mapEpsg = map.getView().getProjection().getCode();
  if (isGpx) {
    const gpx = new GPX({
    });
    features = gpx.readFeatures(data).map(f => {
      f.getGeometry().transform('EPSG:4326', mapEpsg)
      return f;
    });
  } else {
    const isJson = JSON.parse(data);
    if (isJson) {
      const geoJson = new GeoJSON({
        dataProjection: 'EPSG:4326',
        featureProjection: mapEpsg
      });

      if (isJson.type === 'FeatureCollection') {
        features = geoJson.readFeatures(data);
      } else if (isJson.type === 'Feature') {
        features = [geoJson.readFeature(data)];
      }
    }
  }

  if (features.length) {
    const fileLayer = new VectorLayer<VectorSource<PointGeom | LineGeom>>({
      source: new VectorSource({
        features: features
      }),
      style: (feature) => {
        return styles[feature.getGeometry().getType()];
      }
    })
    if (mapLayers.length) {
      fileLayer.set('id', 'FileLayer');
    } else {
      fileLayer.set('id', `FileLayer-${mapLayers.length + 1}`);
    }

    const layerExt = fileLayer.getSource().getExtent();
    map.getView().fit(layerExt);



    map.addLayer(fileLayer);
  }



}



// TODO
export function checkIfLocationInGermany() {
  return true;
}

/**
 *  ----------------------------------------------
 */
export function createImageLayer() {
  const baseurl = `https://www.dwd.de/DWD/wetter/wv_allg/deutschland/bilder/`;
  const urls = [
    `vhs_brd_heutefrueh.jpg`,
    `vhs_brd_heutemittag.jpg`
  ];

}

let currentFeature;
export function displayFeatureInfo(map: Map, evt: MapBrowserEvent<any>) {
  const info = document.getElementById('info');
  const pixel = evt.pixel;
  const feature = evt.originalEvent.target.closest('.ol-control')
    ? undefined
    : map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature;
    });
  if (feature) {
    info.style.left = pixel[0] + 'px';
    info.style.top = pixel[1] + 'px';
    if (feature !== currentFeature) {
      info.style.visibility = 'visible';
      info.innerText = feature.get('ECO_NAME');
    }
  } else {
    info.style.visibility = 'hidden';
  }
  currentFeature = feature;
}

/*
function createPopupHtml(obj: any) {
  let htmlStr = '<table>';
  for (const o in obj) {
    if (obj.hasOwnProperty(o)) {
      htmlStr += '<tr><td style="vertical-align: top; padding-right: 7px;"><b>' + o + ': </b></td><td>' + obj[o] +
        '</td></tr>';
    }
  }
  htmlStr = htmlStr + '</table>';
  return htmlStr;
*/

function createPopupHtml(obj: any) {
  let htmlStr = '';
  for (const o in obj) {
    if (obj.hasOwnProperty(o)) {
      htmlStr += `<div><b>${o}</b>: ${obj[o]}</div>`;
    }
  }
  htmlStr = htmlStr + '</div>';
  return htmlStr;
}


export function getFeatureInfo(map: Map, evt: MapBrowserEvent<any>, places?:IPlaceItem[]) {
  const info = document.getElementById('info');

  const content = document.createElement('div');
  content.className = 'ol-popup-content';
  const popupID = 'layer_popup';
  const popup = new Overlay({
    id: popupID,
    autoPan: {
      animation: {
        duration: 250
      }
    },
    positioning: 'bottom-center',
    stopEvent: true,
    insertFirst: false
  });

  const layers = map.getAllLayers();
  const infoLayer = layers.find(l => l.get('name') && l.get('name') === 'wms-layer');
  console.log(infoLayer)

  if (infoLayer && infoLayer.get('popup')) {
    const wmsSource = infoLayer.getSource() as TileWMS;
    const view = map.getView();
    const viewResolution = view.getResolution();
    const epsg = view.getProjection().getCode()
    const url = wmsSource.getFeatureInfoUrl(
      evt.coordinate,
      viewResolution,
      epsg,
      { INFO_FORMAT: 'application/json' }
    );

    if (url) {
      fetch(url).then(response => response.json())
        .catch((error) => {
          console.log(error);
        })
        .then((data) => {
          if (data.features.length) {
            const feature = data.features[0];
            if (feature) {
              const hasName = (feature?.properties?.NAME as string)?.toLocaleLowerCase()?.replace(/ /g,'_');
              console.log(hasName);
              if(places && hasName){
                const findPlace = places.find(p => p.id === hasName);
                if(findPlace){
                  const newProps = {
                    name: feature.properties.NAME,
                    link: findPlace.linkWeatherOnSite
                  }
                  feature.properties = newProps;
                  content.innerHTML = `<div><a href="${newProps.link}" target="_blank">${newProps.name}</a></div>`;
                }else{
                  content.innerHTML = createPopupHtml(feature.properties);
                }
              }else{
                content.innerHTML = createPopupHtml(feature.properties);
              }
              map.removeOverlay(getOverlays(map, popupID)[0]);
              let coordinate;
              
              if (feature && feature.geometry.type === 'Point') {
                coordinate = feature.geometry.coordinates;
              } else {
                coordinate = evt.coordinate;
              }
              
              popup.setElement(content);
              popup.setPosition(coordinate);
              map.addOverlay(popup);

            } else {
              console.log('remove overlay no feature', getOverlays(map, popupID)[0])
              map.removeOverlay(getOverlays(map, popupID)[0]);
            }
          } else {
            console.log('remove overlay no features', getOverlays(map, popupID)[0])
            map.removeOverlay(getOverlays(map, popupID)[0]);
          }
          currentFeature = data.features[0];
        });
    }

  } else {
    map.removeOverlay(popup);
  }
}

export function getOverlays(map: Map, id?: string) {
  if (id) {
    return [map.getOverlayById(id)];
  } else {
    return map.getOverlays();
  }
}
