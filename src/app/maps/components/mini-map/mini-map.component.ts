import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: [ './mini-map.component.css' ]
})
export class MiniMapComponent implements AfterViewInit {

  public map?: Map;

  @ViewChild('map') divMap?: ElementRef<HTMLElement>;

  @Input() lngLat?: [ number, number ];

  ngAfterViewInit(): void {
    if (!this.divMap?.nativeElement) throw Error('Map Div not found');
    if (!this.lngLat) throw Error("LngLat can't be null");

    this.map = new Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL,
      center: this.lngLat,
      zoom: 15,
      interactive: false
    });

    this.createMarker();
  }

  createMarker(): void {
    if (!this.map) return;

    const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const coordsMarker = this.map!.getCenter();
    this.addMarker(coordsMarker, color);
  }

  addMarker(lngLat: LngLat, color: string): void {
    if (!this.map) return;

    const marker = new Marker({
      color: color
    })
      .setLngLat(lngLat)
      .addTo(this.map);
  }
}
