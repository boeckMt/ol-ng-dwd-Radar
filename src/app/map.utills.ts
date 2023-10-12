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
import { Feature } from 'ol';
import CircleStyle from 'ol/style/Circle';
import { Fill, Style, Stroke, Circle } from 'ol/style';


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
