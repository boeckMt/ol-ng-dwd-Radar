import TileGrid from 'ol/tilegrid/TileGrid';
import { getWidth } from 'ol/extent';
import { get as getProjection } from 'ol/proj';

import { Layer, LayerEntity } from './ogc.types';

import { transform } from 'ol/proj.js';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import PointGeom from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { Coordinate } from 'ol/coordinate';
import { Feature } from 'ol';
import CircleStyle from 'ol/style/Circle';
import { Fill, Style } from 'ol/style';


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
      return new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({
            color: 'rgba(0, 77, 64, 0.8)',
          })
        })
      })
    }
  })
  map.addLayer(locationPont);
  return locationPont;
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
