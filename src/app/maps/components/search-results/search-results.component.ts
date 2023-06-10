import { Component, computed, effect, inject, signal } from '@angular/core';
import { LngLat } from 'mapbox-gl';
import { Feature } from '../../interfaces';
import { PlacesService } from '../../services';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'maps-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: [ './search-results.component.css' ],
})
export class SearchResultsComponent {

  private placesService = inject(PlacesService);
  private mapService    = inject(MapService);

  public places     = computed(() => this.placesService.places());
  public isLoading  = computed(() => this.placesService.isLoadingPlaces());
  public selectedId = computed(() => this.placesService.selectedPlaceId());
  addEffectPlaces = effect(() => {
    if (this.places().length < 1) return;
    this.mapService.createMarkersFromPlaces(this.places(), this.placesService.userLocation()!);
  });

  flyTo(place: Feature) {
    const [ lng, lat ] = place.center;
    this.mapService.flyTo([ lng, lat ]);
  }

  getDirections(place: Feature) {
    if (!this.placesService.userLocation()) throw Error('Ubicacion no obtenida')
    const start = this.placesService.userLocation()!;
    const end = place.center as [ number, number ];

    this.mapService.getRouteBetweenPoints(start, end);
  }
}
