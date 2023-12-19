import '/style.css'
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import {Map, View} from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM';

async function loadGeoJson(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data
}


async function initMap() {

  const geojsonData = await loadGeoJson('data/sampa.geojson');

  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(geojsonData, {
      dataProjection: 'EPSG:4326',
      featureProjection:'EPSG:3857'      
    }),
  });

  const vectorLayer =  new VectorLayer({
    source: vectorSource,
  });

  const baseMapLayer = new TileLayer({
    source: new OSM()
  });

  const map = new Map({
    target: 'map',
    layers: [baseMapLayer, vectorLayer],
    view: new View({
      center: fromLonLat([-46.633308, -23.550520]),
      zoom: 16
    }),
  });
}

initMap();