import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';
import { MarkerAndColor, SimplifiedMarker } from '../../interfaces/marker.interface';


@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: [ './markers-page.component.css' ]
})
export class MarkersPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') divMap?: ElementRef<HTMLElement>;

  public map?: Map;

  public coordinates: LngLat = new LngLat(-3.7026354430291866, 40.40988823657996);

  public markers: MarkerAndColor[] = [];

  ngAfterViewInit(): void {

    if (!this.divMap) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.coordinates, // starting position [lng, lat]
      zoom: 15, // starting zoom
      minZoom: 0, // [0, 24]
      maxZoom: 20 // [0, 24]
    });

    this.readFromLocalStorage();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }


  createMarker(): void {
    if (!this.map) return;

    // const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const color = this.getRandomColor();
    const coordsMarker = this.map!.getCenter();
    this.addMarker(coordsMarker, color);
  }

  deleteMarker(index: number): void {
    this.markers[index].marker.remove();
    this.markers.splice(index, 1);
    this.saveToLocalStorage();
  }

  flyToMarker(marker: Marker): void {
    if (!this.map) return;

    this.map.flyTo({
      zoom: 16,
      center: marker.getLngLat()
    });
  }

  saveToLocalStorage(): void {
    const simplifiedMarkers: SimplifiedMarker[] = this.markers.map(({ color, marker }) => ({
      color,
      coordinates: marker.getLngLat()
        .toArray()
    }));
    localStorage.setItem('simplifiedMarkers', JSON.stringify(simplifiedMarkers));
  }

  readFromLocalStorage(): void {
    const data = localStorage.getItem('simplifiedMarkers');

    if (!data) return;
    const simplifiedMarkers: SimplifiedMarker[] = JSON.parse(data);
    simplifiedMarkers.forEach(({ color, coordinates }) => {
      const [ lng, lat ] = coordinates;
      const coords = new LngLat(lng, lat);
      this.addMarker(coords, color);
    });
  }

  private addMarker(lngLat: LngLat, color: string): void {
    if (!this.map) return;

    const marker = new Marker({
      color: color,
      draggable: true
    })
      .setLngLat(lngLat)
      .addTo(this.map);

    marker.on('dragend', (ev) => this.saveToLocalStorage());
    this.markers.push({ color, marker });
    this.saveToLocalStorage();
  }

  getRandomColor(): string {
    const color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
    return color;
  }
}
