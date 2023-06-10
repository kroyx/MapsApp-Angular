import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Map } from 'mapbox-gl';
import { PlacesService } from '../../services';

@Component({
  templateUrl: './map-page.component.html',
  styleUrls: [ './map-page.component.css' ],
})
export class MapPageComponent {

  private placesService: PlacesService = inject(PlacesService);

  public isUserLocationReady = computed(() => this.placesService.isUserLocationReady());

  constructor() {}
}
