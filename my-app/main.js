import '/style.css'
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import {Map, View} from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';
import { Polygon } from 'ol/geom';


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

  const drawSource = new VectorSource();
  
  const drawLayer = new VectorLayer({
    source: drawSource,
  });

  map.addLayer(drawLayer);

  const drawInteraction = new Draw({
    source: drawSource,
    type: 'Polygon',
  });

  function toggleDrawMode() {
    console.log('Clicando botão');
    if (map.getInteractions().getArray().includes(drawInteraction)) {
      map.removeInteraction(drawInteraction);
    } else {
      map.addInteraction(drawInteraction);
    }
  }

  document.getElementById('draw-button').addEventListener('click', toggleDrawMode);
}

initMap();