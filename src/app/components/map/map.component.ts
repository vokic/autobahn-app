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

  // Define our base layers so we can reference them multiple times
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });
  // wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
  //   detectRetina: true,
  //   attribution:
  //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  // });

  // Marker for the top of Mt. Ranier
  summit = marker([55.8523, 10.7603], {
    icon: icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png',
    }),
  });

  options = {
    layers: [this.streetMaps, this.summit], //this.route,  this.paradise
    zoom: 16,
    center: latLng(44.82372406074781, 20.4476759423291),
  };

  // Marker for the parking lot at the base of Mt. Ranier trails
  // paradise = marker([55.8523, 10.7603], {
  //   icon: icon({
  //     iconSize: [25, 41],
  //     iconAnchor: [13, 41],
  //     iconUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png',
  //     shadowUrl:
  //       'https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png',
  //   }),
  // });

  // Path from paradise to summit - most points omitted from this example for brevity
  // route = polyline([
  //   [46.78465227596462, -121.74141269177198],
  //   [46.80047278292477, -121.73470708541572],
  //   [46.815471360459924, -121.72521826811135],
  //   [46.8360239546746, -121.7323131300509],
  //   [46.844306448474526, -121.73327445052564],
  //   [46.84979408048093, -121.74325201660395],
  //   [46.853193528950214, -121.74823296256363],
  //   [46.85322881676257, -121.74843915738165],
  //   [46.85119913890958, -121.7519719619304],
  //   [46.85103829018772, -121.7542376741767],
  //   [46.85101557523012, -121.75431755371392],
  //   [46.85140013694763, -121.75727385096252],
  //   [46.8525277543813, -121.75995212048292],
  //   [46.85290292836726, -121.76049157977104],
  //   [46.8528160918504, -121.76042997278273],
  // ]);

  // Layers control object with our two base layers and the three overlay layers
  layersControl = {
    baseLayers: {
      //'Street Maps': this.streetMaps,
      //'Wikimedia Maps': this.wMaps,
    },
    overlays: {
      'Mt. Rainier Summit': this.summit,
      // 'Mt. Rainier Paradise Start': this.paradise,
      //'Mt. Rainier Climb Route': this.route,
    },
  };

  // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
}
