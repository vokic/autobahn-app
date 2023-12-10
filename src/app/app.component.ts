import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Roads from '../assets/types/roads.type';
import { MatChipsModule } from '@angular/material/chips';
import { MapComponent } from './components/map/map.component';
import { RoadsService } from './roads.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSelectModule,
    MatFormFieldModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MapComponent,
    MatCardModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'autobahn-app';
  selectedRoad?: Roads[];
  roads: Roads[] = [];
  selectedRoadsControl = new FormControl([]);

  constructor(private roadsService: RoadsService) {}

  ngOnInit() {
    this.roadsService.getAllRoads().subscribe((data) => {
      this.roads = data.roads;
      //console.log(this.roads);
    });

    // this.roadsService.getAllRoadworks('A1').subscribe((data) => {
    //   console.log(data, 'data madafakata');
    // });
  }

  onRoadSelectionChange() {
    // Get the selected roads from the form control
    const selectedRoads: string[] = this.selectedRoadsControl.value as string[];

    // Call the service for each selected road
    selectedRoads.forEach((road) => {
      this.roadsService.getAllRoadworks(road).subscribe((data) => {
        console.log(data, 'Data for road: ' + road);
      });
    });
  }

  get selectedRoads(): string[] {
    return this.selectedRoadsControl.value as string[];
  }

  // onRoadSelectionChange() {
  //   console.log('Selected Road:', this.selectedRoadsControl.value);
  // }
}
