import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MapComponent } from './components/map/map.component';
import { RoadsService } from './roads.service';
import { MatCardModule } from '@angular/material/card';
import { LatLngTuple, icon, latLng, marker, tileLayer } from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import * as L from 'leaflet';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import Roads from '../assets/types/roads.type';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatCheckboxModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  roadworksData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  closureData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  warningsData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  chargingData: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild('roadworksPaginator', { static: true })
  roadworksPaginator: MatPaginator | null = null;
  @ViewChild('closurePaginator', { static: true })
  closurePaginator: MatPaginator | null = null;
  @ViewChild('warningsPaginator', { static: true })
  warningsPaginator: MatPaginator | null = null;
  @ViewChild('chargingPaginator', { static: true })
  chargingPaginator: MatPaginator | null = null;

  headerCols: string[] = ['Title', 'Blocking', 'Subtitle', 'Start'];

  clickedRoadworkRows = new Set<any>();
  clickedClosureRows = new Set<any>();
  clickedWarningRows = new Set<any>();
  clickedChargingRows = new Set<any>();

  markers: any[] = [];

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

  chargingColumns: string[] = ['title', 'subtitle'];

  roads: Roads[] = [];
  selectedRoad: string | undefined;

  element: any;

  isRowClicked: boolean = true;

  constructor(private roadsService: RoadsService) {}

  ngOnInit() {
    this.roadsService.getAllRoads().subscribe((data: any) => {
      this.roads = data.roads;

      this.roadworksData.data = [];
      this.closureData.data = [];
      this.warningsData.data = [];
      this.chargingData.data = [];
    });
  }

  ngAfterViewInit() {
    // Set the paginator for each table
    if (this.roadworksPaginator) {
      this.roadworksData.paginator = this.roadworksPaginator;
    }

    if (this.closurePaginator) {
      this.closureData.paginator = this.closurePaginator;
    }

    if (this.warningsPaginator) {
      this.warningsData.paginator = this.warningsPaginator;
    }

    if (this.chargingPaginator) {
      this.chargingData.paginator = this.chargingPaginator;
    }
  }

  onRoadworksRowClicked(row: any) {
    if (this.clickedRoadworkRows.has(row)) {
      this.clickedRoadworkRows.delete(row);
      this.removeMarker(row.identifier);
    } else {
      this.clickedRoadworkRows.add(row);
      this.getRoadworkDetails(row.identifier);
    }
  }

  onClosureRowClicked(row: any) {
    if (this.clickedClosureRows.has(row)) {
      this.clickedClosureRows.delete(row);

      this.removeMarker(row.identifier);
    } else {
      this.clickedClosureRows.add(row);
      this.getClosingsDetails(row.identifier);
    }
  }

  onWarningRowClicked(row: any) {
    if (this.clickedWarningRows.has(row)) {
      this.clickedWarningRows.delete(row);
      this.removeMarker(row.identifier);
    } else {
      this.clickedWarningRows.add(row);
      this.getWarningsDetails(row.identifier);
    }
  }

  onChargingRowClicked(row: any) {
    if (this.clickedChargingRows.has(row)) {
      this.clickedChargingRows.delete(row);
      this.removeMarker(row.identifier);
    } else {
      this.clickedChargingRows.add(row);
      this.getChargingDetails(row.identifier);
    }
  }

  //Clear markers from map
  clearMarkers(defaultCoordinates: LatLngTuple): void {
    this.markers = [];

    //Clear table selection on clear markers
    this.clickedChargingRows.clear();
    this.clickedWarningRows.clear();
    this.clickedClosureRows.clear();
    this.clickedRoadworkRows.clear();

    this.updateMap();
  }

  removeMarker(roadworkId: string) {
    console.log('Roadwork ID to remove:', roadworkId);

    // Identify the marker in the array
    const markerIndex = this.markers.findIndex(
      (marker) => L.stamp(marker) === parseInt(roadworkId)
    );

    if (markerIndex) {
      // Remove the marker from the Leaflet layer group
      const removedMarker = this.markers.splice(markerIndex, 1)[0];
      this.germany.removeLayer(removedMarker);

      this.updateMap();
    }
  }

  getRoadworkDetails(roadworkId: string) {
    this.roadsService.getRoadworkDetails(roadworkId).subscribe((data: any) => {
      console.log(data, 'single roadwork details');

      const coordinates: LatLngTuple = [
        parseFloat(data.coordinate.lat),
        parseFloat(data.coordinate.long),
      ];

      // Check if a marker with the same coordinates already exists
      const existingMarker = this.findExistingMarker(coordinates);

      if (existingMarker) {
        // Update the position of the existing marker if needed
        existingMarker.setLatLng(coordinates);
      } else {
        // Create a new marker
        const newMarker = marker(coordinates, {
          icon: icon({
            iconSize: [38, 61],
            iconAnchor: [13, 41],
            iconUrl: 'assets/img/markers/marker-roadworks.svg',
          }),
        });

        // Add the new marker to the array and display details on click
        this.markers.push(newMarker);
        newMarker.bindPopup(`
          <img src="assets/img/icons/roadworks-icon.svg">
          <hr>
          <h2 style="font-family: 'Raleway', sans-serif;"">${data.title}</h2>
          <h3 style="color: #2f3542; font-family: 'Raleway', sans-serif;">${data.subtitle}</h3><br>
          <h4 style="color: #7f8c8d; font-family: 'Raleway', sans-serif;">${data.description[5]}</h4>
          <hr>
          <h4 style="color: #e74c3c; font-family: 'Raleway', sans-serif;">${data.description[0]}</h4>
          <h4 style="color: #27ae60; font-family: 'Raleway', sans-serif;">${data.description[1]}</h4>
        `);
      }

      // Update the map with the markers
      this.updateMap();
    });
  }

  getClosingsDetails(closureId: string) {
    this.roadsService.getClosingsDetails(closureId).subscribe((data: any) => {
      console.log(data, 'single closings details');

      const coordinates: LatLngTuple = [
        parseFloat(data.coordinate.lat),
        parseFloat(data.coordinate.long),
      ];

      // Check if a marker with the same coordinates already exists
      const existingMarker = this.findExistingMarker(coordinates);

      if (existingMarker) {
        // Update the position of the existing marker if needed
        existingMarker.setLatLng(coordinates);
      } else {
        // Create a new marker
        const newMarker = marker(coordinates, {
          icon: icon({
            iconSize: [38, 61],
            iconAnchor: [13, 41],
            iconUrl: 'assets/img/markers/marker-closure.svg',
          }),
        });

        // Add the new marker to the array and display details on click
        this.markers.push(newMarker);
        newMarker.bindPopup(`
        <img src="assets/img/icons/closure-icon.svg">
        <hr>
        <h2 style="font-family: 'Raleway', sans-serif;"">${data.title}</h2>
        <h3 style="color: #2f3542; font-family: 'Raleway', sans-serif;">${data.subtitle}</h3><br>
        <h4 style="color: #7f8c8d; font-family: 'Raleway', sans-serif;">${data.description[5]}</h4>
        <hr>
        <h4 style="color: #e74c3c; font-family: 'Raleway', sans-serif;">${data.description[0]}</h4>
        <h4 style="color: #27ae60; font-family: 'Raleway', sans-serif;">${data.description[1]}</h4>
      `);
      }

      // Update the map with the markers
      this.updateMap();
    });
  }

  getWarningsDetails(warningId: string) {
    this.roadsService.getWarningsDetails(warningId).subscribe((data: any) => {
      console.log(data, 'single closings details');

      const coordinates: LatLngTuple = [
        parseFloat(data.coordinate.lat),
        parseFloat(data.coordinate.long),
      ];

      // Check if a marker with the same coordinates already exists
      const existingMarker = this.findExistingMarker(coordinates);

      if (existingMarker) {
        // Update the position of the existing marker if needed
        existingMarker.setLatLng(coordinates);
      } else {
        // Create a new marker
        const newMarker = marker(coordinates, {
          icon: icon({
            iconSize: [38, 61],
            iconAnchor: [13, 41],
            iconUrl: 'assets/img/markers/marker-warning.svg',
          }),
        });

        // Add the new marker to the array and display details on click
        this.markers.push(newMarker);
        newMarker.bindPopup(`
        <img src="assets/img/icons/warning-icon.svg">
        <hr>
        <h2 style="font-family: 'Raleway', sans-serif;"">${data.title}</h2>
        <h3 style="color: #2f3542; font-family: 'Raleway', sans-serif;">${data.subtitle}</h3><br>
        <h4 style="color: #7f8c8d; font-family: 'Raleway', sans-serif;">${data.description[5]}</h4>
        <hr>
        <h4 style="color: #e74c3c; font-family: 'Raleway', sans-serif;">${data.description[0]}</h4>
        <h4 style="color: #27ae60; font-family: 'Raleway', sans-serif;">${data.description[1]}</h4>
      `);
      }

      // Update the map with the markers
      this.updateMap();
    });
  }

  getChargingDetails(chargingId: string) {
    this.roadsService.getChargingDetails(chargingId).subscribe((data: any) => {
      console.log(data, 'single closings details');

      const coordinates: LatLngTuple = [
        parseFloat(data.coordinate.lat),
        parseFloat(data.coordinate.long),
      ];

      // Check if a marker with the same coordinates already exists
      const existingMarker = this.findExistingMarker(coordinates);

      if (existingMarker) {
        // Update the position of the existing marker if needed
        existingMarker.setLatLng(coordinates);
      } else {
        // Create a new marker
        const newMarker = marker(coordinates, {
          icon: icon({
            iconSize: [38, 61],
            iconAnchor: [13, 41],
            iconUrl: 'assets/img/markers/marker-charging.svg',
          }),
        });

        // Add the new marker to the array and display details on click
        this.markers.push(newMarker);
        newMarker.bindPopup(`
        <img src="assets/img/icons/charging-icon.svg">
        <hr>
        <h2 style="font-family: 'Raleway', sans-serif;"">${data.title}</h2>
        <h3 style="color: #2f3542; font-family: 'Raleway', sans-serif;">${data.subtitle}</h3><br>
        <h4 style="color: #7f8c8d; font-family: 'Raleway', sans-serif;">${data.description[5]}</h4>
        <hr>
        <h4 style="color: #e74c3c; font-family: 'Raleway', sans-serif;">${data.description[0]}</h4>
        <h4 style="color: #27ae60; font-family: 'Raleway', sans-serif;">${data.description[1]}</h4>
      `);
      }

      // Update the map with the markers
      this.updateMap();
    });
  }

  // Find an existing marker with the same coordinates
  findExistingMarker(coordinates: LatLngTuple): L.Marker | undefined {
    return this.markers.find((marker) =>
      marker.getLatLng().equals(coordinates)
    );
  }

  updateMap() {
    // Clear existing markers
    this.germany.clearLayers();

    // Add all markers to the layer group
    this.markers.forEach((marker) => {
      this.germany.addLayer(marker);
    });
  }

  // Define our base layers so we can reference them multiple times
  streetMaps = tileLayer(
    'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=onreaGxJVRblaqf1qWWa',
    {
      detectRetina: false,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }
  );

  germany = L.layerGroup([]);

  //Define map size, prevent panning out
  germanyBounds = L.latLngBounds(
    L.latLng(47.2701, 5.8663), // Southwest corner of Germany
    L.latLng(55.0585, 15.0419) // Northeast corner of Germany
  );

  options = {
    layers: [this.streetMaps, this.germany],
    zoom: 6,
    minZoom: 6,
    center: latLng([51.1657, 10.4515]),
    maxBounds: this.germanyBounds,
  };

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
      this.roadworksData.data = data.roadworks;

      // Update isBlocked property to 'YES' or 'NO'
      this.roadworksData.data.forEach((roadwork: any) => {
        roadwork.isBlocked = roadwork.isBlocked ? 'NO' : 'YES';
      });

      // Log the updated data
      console.log(this.roadworksData.data);
    });
  }

  private getAllClosedRoads(selectedRoad: string) {
    this.roadsService.getAllClosedRoads(selectedRoad).subscribe((data: any) => {
      this.closureData.data = data.closure;
      //console.log(data, 'closure data');
      this.closureData.data.forEach((closure: any) => {
        closure.isBlocked = closure.isBlocked ? 'NO' : 'YES';
      });
    });
  }

  private getAllWarnings(selectedRoad: string) {
    this.roadsService.getAllWarnings(selectedRoad).subscribe((data) => {
      this.warningsData.data = data.warning;
      //console.log(data, 'reports data');
      this.warningsData.data.forEach((warning: any) => {
        warning.isBlocked = warning.isBlocked ? 'NO' : 'YES';
      });
    });
  }

  private getAllCharginsStations(selectedRoad: string) {
    this.roadsService.getAllCharginsStations(selectedRoad).subscribe((data) => {
      this.chargingData.data = data.electric_charging_station;

      //console.log(data, 'charging data');
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

  // Layers control object with our two base layers and the three overlay layers
  // layersControl = {
  //   baseLayers: {
  //     'Street Maps': this.streetMaps,
  //     'Wikimedia Maps': this.wMaps,
  //   },
  //   overlays: {
  //     'Mt. Rainier Summit': this.summit,
  //   },
  // };

  // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
}
