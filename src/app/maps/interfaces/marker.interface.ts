import { LngLat, Marker } from 'mapbox-gl';

export interface MarkerAndColor {
  color: string;
  marker: Marker;
}

export interface SimplifiedMarker {
  color: string;
  coordinates: number[];
}
