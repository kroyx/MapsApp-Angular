import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as url from 'url';
import { environment } from '../../../environments/environment';
import {
  Feature,
  PlacesResponse,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {

  // private baseUrl: string  = 'https://api.mapbox.com/search/searchbox/v1';
  private baseUrl: string  = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
  private http: HttpClient = inject(HttpClient);

  private _isUserLocationReady = signal<boolean>(false);
  private _userLocation        = signal<[ number, number ] | undefined>(undefined);
  private _isLoadingPlaces     = signal<boolean>(false);
  private _places              = signal<Feature[]>([]);

  public userLocation        = computed(() => this._userLocation());
  public isUserLocationReady = computed(() => this._isUserLocationReady());
  public isLoadingPlaces     = computed(() => this._isLoadingPlaces());
  public places              = computed(() => this._places());
  public selectedPlaceId     = signal<string | null>(null);

  constructor() {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[ number, number ] | undefined> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this._userLocation.set([ coords.longitude, coords.latitude ]);
          this._isUserLocationReady.set(true);
          resolve(this._userLocation());
        },
        (error) => {
          alert('No se pudo obtener la geolocalización');
          console.log(error);
          reject();
        },
      );
    });
  }

  getPlacesByQuery(query: string) {
    this.selectedPlaceId.set(null);
    if (!query) {
      this._places.set([]);
      return;
    }
    this._isLoadingPlaces.set(true);

    const url: string = `${this.baseUrl}/${query}.json`;

    const params: HttpParams = new HttpParams()
      .set('proximity', this.userLocation()!.toString())
      .set('language', 'es')
      .set('access_token', environment.mapbox_key);

    return this.http.get<PlacesResponse>(url, { params })
      .subscribe(resp => {
        this._isLoadingPlaces.set(false);
        this._places.set(resp.features);
      });
  }
}
