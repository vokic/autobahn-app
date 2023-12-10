import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Roads from '../assets/types/roads.type';
import { MatChipsModule } from '@angular/material/chips';
import { MapComponent } from './components/map/map.component';
import { RoadsService } from './roads.service';
import { MatCardModule } from '@angular/material/card';
import { icon, latLng, marker, tileLayer } from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MapComponent,
    MatCardModule,
    LeafletModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  roadworksData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  closureData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  warningsData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  chargingData: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  title = 'autobahn-app';

  headerCols: string[] = ['Title', 'Blocking', 'Subtitle', 'Start'];

  roadworksColumns: string[] = [
    'title',
    'isBlocked',
    'subtitle',
    'startTimestamp',
  ];

  closureColumns: string[] = [
    'title',
    'isBlocked',
    'subtitle',
    'startTimestamp',
  ];

  warningColumns: string[] = [
    'title',
    'isBlocked',
    'subtitle',
    'startTimestamp',
  ];

  chargingColumns: string[] = [
    'title',
    'isBlocked',
    'subtitle',
    'startTimestamp',
  ];

  roads: string[] = []; // Assuming roads is an array of strings
  selectedRoad: string | undefined;
  roadWorks: any;

  paginator: any = 15;
  sort: any = 'ASC';

  element: any;

  constructor(private roadsService: RoadsService) {}

  ngOnInit() {
    this.roadsService.getAllRoads().subscribe((data: any) => {
      this.roads = data.roads;
      // Update data source with an empty array
      this.roadworksData.data = [];
      this.closureData.data = [];
      this.warningsData.data = [];
      this.chargingData.data = [];
    });
  }

  onRoadSelectionChange() {
    if (this.selectedRoad) {
      this.getAllRoadworks(this.selectedRoad);
      this.getAllClosedRoads(this.selectedRoad);
      this.getAllWarnings(this.selectedRoad);
      this.getAllCharginsStations(this.selectedRoad);
      // this.getAllWebcams(this.selectedRoad);
      // this.getAllPakringAreas(this.selectedRoad);
    }
  }

  private getAllRoadworks(selectedRoad: string) {
    this.roadsService.getAllRoadworks(selectedRoad).subscribe((data: any) => {
      console.log(data);
      this.roadworksData.data = data.roadworks;
    });
  }

  private getAllClosedRoads(selectedRoad: string) {
    this.roadsService.getAllClosedRoads(selectedRoad).subscribe((data: any) => {
      this.closureData.data = data.closure;
      console.log(data, 'closure data');
    });
  }

  private getAllWarnings(selectedRoad: string) {
    this.roadsService.getAllWarnings(selectedRoad).subscribe((data) => {
      this.warningsData.data = data.warning;
      console.log(data, 'reports data');
    });
  }

  private getAllCharginsStations(selectedRoad: string) {
    this.roadsService.getAllCharginsStations(selectedRoad).subscribe((data) => {
      this.chargingData.data = data.electric_charging_station;
      console.log(data, 'charging data');
    });
  }

  // private getAllWebcams(selectedRoad: string) {
  //   this.roadsService.getAllWebcams(selectedRoad).subscribe((data) => {
  //     console.log(data, 'cams data');
  //   });
  // }

  // private getAllPakringAreas(selectedRoad: string) {
  //   this.roadsService.getAllPakringAreas(selectedRoad).subscribe((data) => {
  //     console.log(data, 'parking data');
  //   });
  // }

  // private getAllCharginsStations(selectedRoad: string) {
  //   this.roadsService.getAllCharginsStations(selectedRoad).subscribe((data) => {
  //     console.log(data, 'charging data');
  //   });
  // }

  // getAllRoadworks() {
  //   if (Array.isArray(this.selectedRoads)) {
  //     // 'this.roadIds' is an array
  //     this.selectedRoads.forEach((roadId: string) => {
  //       this.roadsService.getAllRoadworks(roadId).subscribe((data) => {
  //         console.log(data, 'Data for road from MAP: ' + roadId);
  //       });
  //     });
  //   } else {
  //     // 'this.roadIds' is a single string
  //     const roadId = this.selectedRoads as string;
  //     this.roadsService.getAllRoadworks(roadId).subscribe((data) => {
  //       console.log(data, 'Data for road from MAP: ' + roadId);
  //     });
  //   }
  // }

  // Define our base layers so we can reference them multiple times
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });

  // Marker for the top of Mt. Ranier
  monument = marker([44.82372406074781, 20.4476759423291], {
    icon: icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png',
    }),
  });

  options = {
    layers: [this.streetMaps, this.monument], //this.route,  this.paradise
    zoom: 16,
    center: latLng(44.82372406074781, 20.4476759423291),
  };

  layersControl = {
    baseLayers: {},
    overlays: {
      'Mt. Rainier Summit': this.monument,
    },
  };
}
