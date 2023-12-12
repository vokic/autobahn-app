import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Roads from '../assets/types/roads.type';
import BaseObject from '../assets/types/base-object.type';

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

  getAllRoadworks(roadId: string): Observable<{ roadworks: any[] }> {
    return this.http.get<{ roadworks: any[] }>(
      this.apiUrl + `/${roadId}/services/roadworks`
    );
  }

  getAllClosedRoads(roadId: string): Observable<{ closure: any }> {
    return this.http.get<{ closure: any[] }>(
      this.apiUrl + `/${roadId}/services/closure`
    );
  }

  getAllWarnings(roadId: string): Observable<{ warning: any[] }> {
    return this.http.get<{ warning: any[] }>(
      this.apiUrl + `/${roadId}/services/warning`
    );
  }

  getAllCharginsStations(
    roadId: string
  ): Observable<{ electric_charging_station: any[] }> {
    return this.http.get<{ electric_charging_station: any[] }>(
      this.apiUrl + `/${roadId}/services/electric_charging_station`
    );
  }

  getRoadworkDetails(
    roadworkId: string
  ): Observable<{ roadworkDetails: BaseObject }> {
    return this.http.get<{ roadworkDetails: BaseObject }>(
      this.apiUrl + `/details/roadworks/${roadworkId}`
    );
  }

  getClosingsDetails(
    closureId: string
  ): Observable<{ closureDetails: BaseObject }> {
    return this.http.get<{ closureDetails: BaseObject }>(
      this.apiUrl + `/details/closure/${closureId}`
    );
  }

  getWarningsDetails(
    warningId: string
  ): Observable<{ warningDetails: BaseObject }> {
    return this.http.get<{ warningDetails: BaseObject }>(
      this.apiUrl + `/details/warning/${warningId}`
    );
  }

  getChargingDetails(
    stationId: string
  ): Observable<{ stationDetails: BaseObject }> {
    return this.http.get<{ stationDetails: BaseObject }>(
      this.apiUrl + `/details/electric_charging_station/${stationId}`
    );
  }

  // getAllWebcams(roadId: string): Observable<{ roadworks: Roadworks[] }> {
  //   return this.http.get<{ roadworks: Roadworks[] }>(
  //     this.apiUrl + `/${roadId}/services/webcam`
  //   );
  // }

  // getAllPakringAreas(roadId: string): Observable<{ roadworks: Roadworks[] }> {
  //   return this.http.get<{ roadworks: Roadworks[] }>(
  //     this.apiUrl + `/${roadId}/services/parking_lorry`
  //   );
  // }

  // getAllCharginsStations(
  //   roadId: string
  // ): Observable<{ roadworks: Roadworks[] }> {
  //   return this.http.get<{ roadworks: Roadworks[] }>(
  //     this.apiUrl + `/${roadId}/services/electric_charging_station`
  //   );
  // }
}
