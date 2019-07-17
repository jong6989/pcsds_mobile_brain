import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from 'src/app/services/map.service';
import { GeoJson, FeatureCollection } from '../../services/map';
import { environment } from '../../../environments/environment';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.page.html',
  styleUrls: ['./tracker.page.scss'],
})
export class TrackerPage implements OnInit {
  map: mapboxgl.Map;
  style: 'mapbox://styles/jong6989/cjy63ouw719wt1cph1nddleep';
  lat = 9.927;
  lng = 118.693;
  name = "Steve";

  source: any;
  markers: Observable<any[]>;

  constructor(
    private mapService: MapService
  ) {
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(environment.mapbox.accessToken);
   }

  ngOnInit() {
    this.markers = this.mapService.getMarkers();
    this.initializeMap();
  }

  initializeMap() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.lat = pos.coords.latitude;
        this.lng = pos.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat]
        });
      })
    }
    this.buildMap();
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 7.19,
      center: [this.lng, this.lat]
    });

    this.map.addControl(new mapboxgl.NavigationControl);

    this.map.on('click', (event) => {
      const coordinates = [event.lngLat.lng, event.lngLat.lat];
      const newMarker = new GeoJson(coordinates, {name: this.name});
      this.mapService.createMarker(newMarker);
    });

    this.map.on('load', (event) => {
      this.map.addSource('firebase',{
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      this.source = this.map.getSource('firebase');

      this.markers.subscribe( markers => {
        let data = new FeatureCollection(markers);
        this.source.setData(data);
      } );

      this.map.addLayer(
        {
          id: 'firebase',
          source: 'firebase',
          type: 'symbol',
          layout: {
            'text-field': '{name}',
            'text-size': 24,
            'text-transform': 'uppercase',
            'icon-image': 'rocket-15',
            'text-offset': [0,1.6]
          },
          paint: {
            'text-color': '#f16624',
            'text-halo-color': '#fff',
            'text-halo-width': 2
          }
        }
      );

    });
  }

  removeMarker(x: any) {
    this.mapService.removeMarker(x.$key);
  }

  flyToMarker(data: GeoJson) {
    this.map.flyTo({
      center: data.geometry.coordinates
    });
  }

}
