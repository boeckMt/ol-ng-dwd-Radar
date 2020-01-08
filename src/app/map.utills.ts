import TileGrid from 'ol/tilegrid/TileGrid';
import { getWidth } from 'ol/extent';
import { get as getProjection } from 'ol/proj';

import LayerGroup from 'ol/layer/Group';

import View from 'ol/View';
import { transform } from 'ol/proj.js';
import Map from 'ol/Map';


export function findLayerRecursive(lLayergroup: LayerGroup, path: string) {
    const names: Array<string> = path.split('.');
    if (names.length > 0) {
        for (const layer of lLayergroup.Layer) {
            if (layer.Name === names[0]) {
                if (layer.Layer) {
                    names.shift();
                    const _path = names.join('.');
                    return findLayerRecursive(layer, _path);
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
        extent: extent,
        resolutions: resolutions,
        tileSize: [512, 256]
    });
}

export function getLocation(map: Map, EPSGCODE) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            if (checkIfLocationInGermany()) {
                map.setView(new View({
                    center: transform([position.coords.longitude, position.coords.latitude], 'EPSG:4326', EPSGCODE),
                    zoom: 7
                }));
            }
        });
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
    ]

}