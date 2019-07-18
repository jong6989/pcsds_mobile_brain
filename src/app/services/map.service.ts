import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AngularFireDatabase } from '@angular/fire/database'; 
import * as mapboxgl from 'mapbox-gl';
import { GeoJson } from './map';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(
    private db: AngularFireDatabase
  ) {
    // (mapboxgl as typeof mapboxgl).accessToken = environment.mapbox.accessToken;
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(environment.mapbox.accessToken);
   }

  getMarkers(): Observable<any[]> {
    return this.db.list('/testMarkers').valueChanges();
  }

  createMarker(data: GeoJson) {
    return this.db.list('/testMarkers').push(data);
  }

  removeMarker($key: string) {
    return this.db.list('/testMarkers/' + $key).remove();
  }

}
