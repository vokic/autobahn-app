import { Component, Input, OnInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { icon, latLng, marker, polyline, tileLayer } from 'leaflet';
import { RoadsService } from '../../roads.service';

Leaflet.Icon.Default.imagePath = 'assets/';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  imports: [LeafletModule],
  standalone: true,
})
export class MapComponent implements OnInit {
  constructor(private roadsService: RoadsService) {}

  @Input() roadIds: string[] | string = [];

  centerPosition: L.LatLngExpression = [42.3601, -71.0589];
  map?: Leaflet.Map;

  ngOnInit(): void {
    console.log('ngOnInit called');
    setTimeout(() => {
      this.initMap();
      console.log(this.roadIds, 'road id');
    }, 0);
  }

  initMap(): void {
    const mapElement = document.getElementById('map');
    console.log('Map Element:', mapElement);
    this.map = Leaflet.map('map', {
      center: this.centerPosition,
      zoom: 12,
    });
  }

  // Base layer
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });

  // Marker
  gate = marker([52.51697971377121, 13.377639726821188], {
    icon: icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png',
    }),
  });

  options = {
    layers: [this.streetMaps, this.gate],
    zoom: 16,
    center: latLng(52.51697971377121, 13.377639726821188),
  };

  // Layers control
  layersControl = {
    baseLayers: {},
    overlays: {
      'Brandenburg Gate': this.gate,
    },
  };
}
