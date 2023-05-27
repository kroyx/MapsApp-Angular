import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: [ './zoom-range-page.component.css' ]
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') divMap?: ElementRef<HTMLElement>;

  public map?: Map;

  public zoomLevel: number = 10;

  public coordinates: LngLat = new LngLat(-3.7026354430291866, 40.40988823657996);

  ngAfterViewInit(): void {

    if (!this.divMap) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.coordinates, // starting position [lng, lat]
      zoom: this.zoomLevel, // starting zoom
      minZoom: 0, // [0, 24]
      maxZoom: 20 // [0, 24]
    });

    this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  mapListeners(): void {
    if (!this.map) throw Error('Mapa no inicializado');

    // Detecta cuándo se hace zoom
    this.map.on('zoom', () => {
      this.zoomLevel = this.map!.getZoom();
    });

    this.map.on('move', () => {
      this.coordinates = this.map!.getCenter();
    });
  }

  zoomIn(): void {
    this.map?.zoomIn();
  }

  zoomOut(): void {
    this.map?.zoomOut();
  }

  zoomChanged(value: string): void {
    this.zoomLevel = Number(value);
    this.map?.zoomTo(this.zoomLevel);
  }
}
