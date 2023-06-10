import { AfterViewInit, Component, computed, ElementRef, inject, ViewChild } from '@angular/core';
import { Map, Marker, Popup } from 'mapbox-gl';
import { PlacesService } from '../../services';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'maps-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: [ './map-view.component.css' ],
})
export class MapViewComponent implements AfterViewInit {

  private placesService = inject(PlacesService);
  private mapService = inject(MapService);

  public userLocation = computed(() => this.placesService.userLocation());

  @ViewChild('map') divMap?: ElementRef<HTMLElement>;

  constructor() {}

  ngAfterViewInit(): void {
    if (!this.divMap) throw Error('No se ha encontrado el elemento HTML');
    if (!this.userLocation()) throw Error('No se ha obtenido la ubicación del usuario');

    const map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.userLocation(),
      zoom: 14,
      minZoom: 0,
    });

    const popup = new Popup()
      .setHTML(`
        <h6>Aquí Estoy</h6>
        <span>Estoy en este lugar del mundo</span>
      `);

    new Marker({ color: 'red' })
      .setLngLat(this.userLocation()!)
      .setPopup(popup)
      .addTo(map)

    this.mapService.setMap(map);
  }

  goToMyLocation(): void {
    if (!this.mapService.isMapReady()) return;
    this.mapService.flyTo(this.userLocation()!);
  }
}
