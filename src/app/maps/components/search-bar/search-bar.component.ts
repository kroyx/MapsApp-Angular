import { Component, inject } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'maps-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  private debounceTimer?: NodeJS.Timeout;
  private placesService = inject(PlacesService);

  onQueryChange(query: string): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout( () => {
      this.placesService.getPlacesByQuery(query);
    },1000);
  }
}
