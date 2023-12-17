import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RoadsService } from '../../roads.service';
import { LatLngTuple, icon, marker } from 'leaflet';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

interface CustomMarkerOptions extends L.MarkerOptions {
  identifier?: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatPaginatorModule, MatTableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {
  constructor(private roadsService: RoadsService) {}

  selectedColumns: any[] = [];
  selectedDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() selectedIndex: number = 0;
  @Input() selectedData!: string;
  @Input() germany: any;
  @Input() clickedRoadworkRows: any;
  @Input() clickedClosureRows: any;
  @Input() markers: any;
  @Input() roads: any;
  @Input() selectedRoad: any;
  @Input() roadworksData: MatTableDataSource<any> = new MatTableDataSource<any>(
    []
  );
  @Input() closureData: MatTableDataSource<any> = new MatTableDataSource<any>(
    []
  );

  @Output() clearClosuresEvent: EventEmitter<void> = new EventEmitter<void>();

  class: boolean = false;

  unifiedCols: any[] = [
    { name: 'Name', value: 'title' },
    { name: 'Blocked road', value: 'isBlocked' },
    { name: 'Details', value: 'subtitle' },
    { name: 'Starting', value: 'startTimestamp' },
  ];

  clickedRow: Set<any> | null = new Set();

  selectedRows: any[] = [];

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.roadworksData.paginator = this.paginator;
    this.closureData.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRoad']) {
      const newSelectedRoad = changes['selectedRoad'].currentValue;
      console.log('Selected Road in Child:', newSelectedRoad);

      // Call the method to fetch roadworks and closures data
      this.loadData();
    }

    if (changes['selectedIndex']) {
      const newSelectedIndex = changes['selectedIndex'].currentValue;

      // Do something with the newSelectedIndex, for example, trigger a method
      this.handleSelectedIndex(newSelectedIndex);
    }
  }

  private loadData() {
    if (this.selectedIndex !== null && this.selectedRoad) {
      this.getAllData(this.selectedRoad, this.selectedIndex);
    }
  }

  private getAllData(selectedRoad: string, selectedIndex: number) {
    // Load roadworks data
    this.roadsService.getAllRoadworks(selectedRoad).subscribe((data: any) => {
      // Process roadworks data
      this.roadworksData.data = data.roadworks;

      this.roadworksData.data.forEach((roadwork: any) => {
        roadwork.isBlocked = roadwork.isBlocked ? 'No' : 'Yes';
        roadwork.startTimestamp = this.formatDate(
          roadwork.startTimestamp,
          'dd.MM.yyyy HH:mm:ss'
        );

        //roadwork.startTimestamp = this.formatDate(roadwork.startTimestamp);
      });

      // Set appropriate columns and data source based on selectedIndex
      this.handleSelectedIndex(selectedIndex || this.selectedIndex);
    });

    // Load closures data
    this.roadsService.getAllClosedRoads(selectedRoad).subscribe((data: any) => {
      // Process closures data
      this.closureData.data = data.closure;

      this.closureData.data.forEach((closure: any) => {
        closure.isBlocked = closure.isBlocked ? 'No' : 'Yes';
        closure.startTimestamp = this.formatDate(
          closure.startTimestamp,
          'dd.MM.yyyy HH:mm:ss'
        );
      });

      // Set appropriate columns and data source based on selectedIndex
      this.handleSelectedIndex(selectedIndex || this.selectedIndex);
    });
  }

  private handleSelectedIndex(selectedIndex: number): void {
    let selectedData: MatTableDataSource<any, MatPaginator> | null = null;
    let selectedColumns: any[] = this.unifiedCols;

    if (selectedIndex === 0) {
      selectedData = this.roadworksData;
    } else if (selectedIndex === 1) {
      selectedData = this.closureData;
    }

    this.selectedColumns = [...selectedColumns];
    this.selectedDataSource.data = selectedData ? [...selectedData.data] : [];
  }

  getColumnValues(): string[] {
    return this.unifiedCols.map((column) => column.value);
  }

  onRowClicked(rowData: any) {
    const index = this.selectedRows.indexOf(rowData);

    if (index !== -1) {
      // If the row is already in the array, remove it
      this.selectedRows.splice(index, 1);
    } else {
      // If the row is not in the array, add it
      this.selectedRows.push(rowData);
    }

    // Your existing logic for handling row clicks
    if (this.selectedIndex === 0) {
      this.onRoadworksRowClicked(rowData);
      console.log('roadwork clicked in table');
    } else if (this.selectedIndex === 1) {
      this.onClosureRowClicked(rowData);
      console.log('closure clicked in table');
    }
  }

  clearSelection() {
    // Clear the selected rows
    this.selectedRows = [];
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

  removeRoadworksMarker(roadworkId: string) {
    // Identify the roadworks marker in the array based on the unique identifier
    const markerIndex = this.markers.findIndex(
      (marker: any) =>
        (marker.options as CustomMarkerOptions).identifier === roadworkId
    );

    if (markerIndex >= 0) {
      // Remove the roadworks marker from the Leaflet layer group
      const removedMarker = this.markers.splice(markerIndex, 1)[0];
      this.germany.removeLayer(removedMarker);

      this.updateMap();
    }
  }

  removeClosureMarker(closureId: string) {
    // Identify the roadworks marker in the array based on the unique identifier
    const markerIndex = this.markers.findIndex(
      (marker: any) =>
        (marker.options as CustomMarkerOptions).identifier === closureId
    );

    if (markerIndex >= 0) {
      // Remove the roadworks marker from the Leaflet layer group
      const removedMarker = this.markers.splice(markerIndex, 1)[0];
      this.germany.removeLayer(removedMarker);

      this.updateMap();
    }
  }

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
          type: 'roadworks',
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
          type: 'closing',
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

  findExistingMarker(coordinates: LatLngTuple): L.Marker | undefined {
    return this.markers.find((marker: any) =>
      marker.getLatLng().equals(coordinates)
    );
  }

  // Format date to German local format
  // To Do: Use pipe!
  private formatDate(date: string, format: string): string {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      // Ensure that the parsed date is valid
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',

        // Add other formatting options as needed
      };

      return parsedDate.toLocaleDateString('de-DE', options);
    } else {
      // Return the original date if parsing fails
      return date;
    }
  }

  updateMap() {
    // Clear existing markers
    this.germany.clearLayers();

    // Add all markers to the layer group
    this.markers.forEach((marker: any) => {
      this.germany.addLayer(marker);
    });
  }
}
