import { computed, inject, Injectable, signal } from '@angular/core';
import { AnyLayer, AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { DirectionsApiClient } from '../api/directionsApiClient';
import { DirectionsResponse, Feature, Route } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MapService {

  private directionsApi = inject(DirectionsApiClient);

  private _map?: Map;
  private markers: Marker[] = [];


  public isMapReady = computed(() => !!this._map);

  private drawPolyline(route: Route) {
    if (!this._map) throw Error('Mapa no inicializado');

    const coords = route.geometry.coordinates;
    const start  = coords[0] as [ number, number ];

    const bounds = new LngLatBounds();
    coords.forEach(([ lng, lat ]) => {
      bounds.extend([ lng, lat ]);
    });

    this._map.fitBounds(bounds, {
      padding: 200,
    });

    // Polyline
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
          },
        ],
      },
    };
    // Limpieza de rutas anteriores
    if (this._map.getLayer('RouteString')) {
      this._map.removeLayer('RouteString');
      this._map.removeSource('RouteString');
    }

    this._map.addSource('RouteString', sourceData);

    const layer: AnyLayer = {
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'black',
        'line-width': 3,
      },
    };
    this._map.addLayer(layer);
  }

  setMap(map: Map) {
    this._map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this._map) throw Error('El mapa no está inicializado');

    this._map!.flyTo({
      zoom: 14,
      center: coords,
    });
  }

  createMarkersFromPlaces(places: Feature[], userLocation: LngLatLike) {
    if (!this._map) throw Error('Mapa no inicializado');

    this.markers.forEach(marker => marker.remove());
    const newMarkers: Marker[] = [];

    if (places.length < 1) return;
    for (const place of places) {
      const [ lng, lat ] = place.center;
      const popup        = new Popup()
        .setHTML(`
          <h6>${place.text}</h6>
          <span>${place.place_name}</span>
        `);

      const newMarker = new Marker()
        .setLngLat([ lng, lat ])
        .setPopup(popup)
        .addTo(this._map);

      newMarkers.push(newMarker);
    }

    this.markers = newMarkers;
    if (places.length < 1) return;

    const bounds = new LngLatBounds();
    bounds.extend(userLocation);
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    this._map.fitBounds(bounds, {
      padding: 200,
    });
  }

  getRouteBetweenPoints(start: [ number, number ], end: [ number, number ]) {
    const url = `/${start.join(',')};${end.join(',')}`;
    this.directionsApi.get<DirectionsResponse>(url)
      .subscribe(resp => {
        this.drawPolyline(resp.routes[0]);
      });
  }
}
