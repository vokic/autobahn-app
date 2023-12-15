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
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

class CustomMarker extends L.Marker {
  constructor(latlng: L.LatLngExpression, options?: CustomMarkerOptions) {
    super(latlng, options);
  }
}

interface CustomMarkerOptions extends L.MarkerOptions {
  identifier?: string;
}

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
    MatBadgeModule,
    MatTooltipModule,
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

  clickedRoadworkRows = new Set<any>();
  clickedClosureRows = new Set<any>();
  clickedWarningRows = new Set<any>();
  clickedChargingRows = new Set<any>();

  markers: any[] = [];

  roadworksColumns: any[] = [
    { name: 'Name', value: 'title' },
    { name: 'Blocked status', value: 'isBlocked' },
    { name: 'Details', value: 'subtitle' },
    { name: 'Starting', value: 'startTimestamp' },
  ];

  closureColumns: any[] = [
    { name: 'Name', value: 'title' },
    { name: 'Blocked status', value: 'isBlocked' },
    { name: 'Details', value: 'subtitle' },
    { name: 'Starting', value: 'startTimestamp' },
  ];

  warningColumns: any[] = [
    { name: 'Name', value: 'title' },
    { name: 'Blocked status', value: 'isBlocked' },
    { name: 'Details', value: 'subtitle' },
    { name: 'Starting', value: 'startTimestamp' },
  ];

  chargingColumns: any[] = [
    { name: 'Name', value: 'title' },
    { name: 'Details', value: 'subtitle' },
  ];

  roads: Roads[] = [];
  selectedRoad: string | null = null;

  element: any;

  isRowClicked: boolean = true;

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
    L.latLng(30.2701, 1.8663), // South West corner of Germany
    L.latLng(65.0585, 18.0419) // North East corner of Germany
  );

  options = {
    layers: [this.streetMaps, this.germany],
    zoom: 6,
    minZoom: 6,
    center: latLng([51.1657, 10.4515]),
    maxBounds: this.germanyBounds,
  };

  constructor(private roadsService: RoadsService) {}

  getRoadworksColumnValues(): string[] {
    return this.roadworksColumns.map((column) => column.value);
  }

  getClosureColumnValues(): string[] {
    return this.closureColumns.map((column) => column.value);
  }

  getWarningColumnValues(): string[] {
    return this.warningColumns.map((column) => column.value);
  }

  getChargingColumnValues(): string[] {
    return this.chargingColumns.map((column) => column.value);
  }

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

  onRoadworksRowClicked(rowRoadworks: any) {
    if (this.clickedRoadworkRows.has(rowRoadworks)) {
      this.clickedRoadworkRows.delete(rowRoadworks);
      this.removeRoadworksMarker(rowRoadworks.identifier);
    } else {
      this.clickedRoadworkRows.add(rowRoadworks);
      this.getRoadworkDetails(rowRoadworks.identifier);
    }
  }

  onClosureRowClicked(rowClosure: any) {
    if (this.clickedClosureRows.has(rowClosure)) {
      this.clickedClosureRows.delete(rowClosure);

      this.removeClosureMarker(rowClosure.identifier);
    } else {
      this.clickedClosureRows.add(rowClosure);
      this.getClosingsDetails(rowClosure.identifier);
    }
  }

  onWarningRowClicked(rowWarning: any) {
    if (this.clickedWarningRows.has(rowWarning)) {
      this.clickedWarningRows.delete(rowWarning);

      this.removeWarningsMarker(rowWarning.identifier);
    } else {
      this.clickedWarningRows.add(rowWarning);
      this.getWarningsDetails(rowWarning.identifier);
    }
  }

  onChargingRowClicked(rowCharging: any) {
    if (this.clickedChargingRows.has(rowCharging)) {
      this.clickedChargingRows.delete(rowCharging);

      this.removeChargingsMarker(rowCharging.identifier);
    } else {
      this.clickedChargingRows.add(rowCharging);
      this.getChargingDetails(rowCharging.identifier);
    }
  }

  //Clear all markers from map
  clearMarkers(): void {
    this.markers = [];

    //Clear table selection on clear markers
    this.clickedChargingRows.clear();
    this.clickedWarningRows.clear();
    this.clickedClosureRows.clear();
    this.clickedRoadworkRows.clear();

    this.updateMap();
  }

  clearSelection() {
    this.selectedRoad = null;
    this.roadworksData.data = [];
    this.closureData.data = [];
    this.warningsData.data = [];
    this.chargingData.data = [];
    this.clearMarkers();
  }

  //Remove markers
  removeRoadworksMarker(roadworkId: string) {
    // Identify the roadworks marker in the array based on the unique identifier
    const markerIndex = this.markers.findIndex(
      (marker) =>
        (marker.options as CustomMarkerOptions).identifier === roadworkId
    );

    if (markerIndex >= 0) {
      // Remove the roadworks marker from the Leaflet layer group
      const removedMarker = this.markers.splice(markerIndex, 1)[0];
      this.germany.removeLayer(removedMarker);

      this.updateMap();
    }
  }

  clearRoadworks() {
    this.roadworksData.data.forEach((roadwork) => {
      this.removeRoadworksMarker(roadwork.identifier);
    });

    this.clickedRoadworkRows.clear();
  }

  clearClosures() {
    this.closureData.data.forEach((closure) => {
      this.removeClosureMarker(closure.identifier);
    });

    this.clickedClosureRows.clear();
  }

  clearWarnings() {
    this.warningsData.data.forEach((warning) => {
      this.removeWarningsMarker(warning.identifier);
    });

    this.clickedWarningRows.clear();
  }

  clearCharging() {
    this.chargingData.data.forEach((charging) => {
      this.removeChargingsMarker(charging.identifier);
    });

    this.clickedChargingRows.clear();
  }

  removeClosureMarker(closureId: string) {
    // Identify the roadworks marker in the array based on the unique identifier
    const markerIndex = this.markers.findIndex(
      (marker) =>
        (marker.options as CustomMarkerOptions).identifier === closureId
    );

    if (markerIndex >= 0) {
      // Remove the roadworks marker from the Leaflet layer group
      const removedMarker = this.markers.splice(markerIndex, 1)[0];
      this.germany.removeLayer(removedMarker);

      this.updateMap();
    }
  }

  removeWarningsMarker(warningId: string) {
    // Identify the roadworks marker in the array based on the unique identifier
    const markerIndex = this.markers.findIndex(
      (marker) =>
        (marker.options as CustomMarkerOptions).identifier === warningId
    );

    if (markerIndex >= 0) {
      // Remove the roadworks marker from the Leaflet layer group
      const removedMarker = this.markers.splice(markerIndex, 1)[0];
      this.germany.removeLayer(removedMarker);

      this.updateMap();
    }
  }

  removeChargingsMarker(chargingId: string) {
    // Identify the charging marker in the array based on the unique identifier
    const markerIndex = this.markers.findIndex(
      (marker) =>
        (marker.options as CustomMarkerOptions).identifier === chargingId
    );

    if (markerIndex >= 0) {
      // Remove the charging marker from the Leaflet layer group
      const removedMarker = this.markers.splice(markerIndex, 1)[0];
      this.germany.removeLayer(removedMarker);

      this.updateMap();
    }
  }

  //Get details
  getRoadworkDetails(roadworkId: string) {
    this.roadsService.getRoadworkDetails(roadworkId).subscribe((data: any) => {
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
          identifier: roadworkId,
        } as CustomMarkerOptions);

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
          identifier: closureId,
        } as CustomMarkerOptions);

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
          identifier: warningId,
        } as CustomMarkerOptions);

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
    this.roadsService.getWarningsDetails(chargingId).subscribe((data: any) => {
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
          identifier: chargingId,
        } as CustomMarkerOptions);

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

  //Format date to specific format  "hh.mm DD.mmm.YY" format
  //To Do: Use pipe!
  private formatDate(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const monthAbbrev = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const year = date.getFullYear().toString().slice(-2);

    return `${hours}.${minutes}h | ${day} ${
      monthAbbrev[date.getMonth()]
    } ${year}`;
  }

  // Define our base layers so we can reference them multiple times

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

        // Date format
        const startTimestamp = new Date(roadwork.startTimestamp);
        roadwork.startTimestamp = this.formatDate(startTimestamp);
      });

      // Log the updated data
      console.log(this.roadworksData.data);
    });
  }
  private getAllClosedRoads(selectedRoad: string) {
    this.roadsService.getAllClosedRoads(selectedRoad).subscribe((data: any) => {
      this.closureData.data = data.closure;

      // Update isBlocked property to 'YES' or 'NO'
      this.closureData.data.forEach((closure: any) => {
        closure.isBlocked = closure.isBlocked ? 'NO' : 'YES';

        //Date format
        const startTimestamp = new Date(closure.startTimestamp);
        closure.startTimestamp = this.formatDate(startTimestamp);
      });
    });
  }

  private getAllWarnings(selectedRoad: string) {
    this.roadsService.getAllWarnings(selectedRoad).subscribe((data) => {
      this.warningsData.data = data.warning;

      // Update isBlocked property to 'YES' or 'NO'
      this.warningsData.data.forEach((warning: any) => {
        warning.isBlocked = warning.isBlocked ? 'NO' : 'YES';

        //Date format
        const startTimestamp = new Date(warning.startTimestamp);
        warning.startTimestamp = this.formatDate(startTimestamp);
      });
    });
  }

  private getAllCharginsStations(selectedRoad: string) {
    this.roadsService.getAllCharginsStations(selectedRoad).subscribe((data) => {
      this.chargingData.data = data.electric_charging_station;

      //console.log(data, 'charging data');
    });
  }
}
