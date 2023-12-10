import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Roads from '../assets/types/roads.type';
import Roadworks from '../assets/types/roadworks.type';

@Injectable({
  providedIn: 'root',
})
export class RoadsService {
  private apiUrl = 'https://verkehr.autobahn.de/o/autobahn/';
  private http = inject(HttpClient);

  constructor() {}

  getAllRoads(): Observable<{ roads: Roads[] }> {
    return this.http.get<{ roads: Roads[] }>(this.apiUrl);
  }

  getAllRoadworks(roadId: string): Observable<{ roadworks: Roadworks[] }> {
    return this.http.get<{ roadworks: Roadworks[] }>(
      this.apiUrl + `/${roadId}/services/roadworks`
    );
  }
}
