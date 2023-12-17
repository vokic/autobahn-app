import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { RoadsService } from './roads.service';
import { MatCardModule } from '@angular/material/card';
import { latLng, tileLayer } from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import Roads from '../assets/types/roads.type';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableComponent } from './shared/table/table.component';
import * as L from 'leaflet';

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
    TableComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @Output() roadSelectionChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedIndexChange = new EventEmitter<number>();
  @ViewChild(TableComponent) tableRef!: TableComponent;

  roadworksData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  closureData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  warningsData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  chargingsData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  parkingData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  cameraData: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  roads: Roads[] = [];
  selectedRoad: string | null = null;
  markers: any[] = [];
  element: any;
  isRowClicked: boolean = true;
  selectedIndex: number = 0;
  map!: L.Map;

  clickedRoadworkRows = new Set<any>();
  clickedClosureRows = new Set<any>();
  clickedWarningRows = new Set<any>();
  clickedChargingRows = new Set<any>();
  clickedParkingRows = new Set<any>();
  clickedCameraRows = new Set<any>();

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

  ngOnInit() {
    this.roadsService.getAllRoads().subscribe((data: any) => {
      this.roads = data.roads;

      this.roadworksData.data = [];
      this.closureData.data = [];
      this.warningsData.data = [];
      this.chargingsData.data = [];
      this.parkingData.data = [];
      this.cameraData.data = [];
    });
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.selectedIndex = event.index;
  }

  onSelectedRoadChange(event: MatSelectChange): void {
    this.clearAllMarkers();
    const selectedRoad = event.value;

    // Emit the selected value to the child component
    this.roadSelectionChange.emit(selectedRoad);
  }

  //Clear all markers from map
  clearAllMarkers(): void {
    this.markers = [];

    this.germany.clearLayers();
    this.tableRef.clearSelection();
  }
}
