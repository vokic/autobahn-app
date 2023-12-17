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

  //ROADS

  getAllRoads(): Observable<{ roads: Roads[] }> {
    return this.http.get<{ roads: Roads[] }>(this.apiUrl);
  }

  //GENERAL

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

  getAllParkings(roadId: string): Observable<{ parking_lorry: any[] }> {
    return this.http.get<{ parking_lorry: any[] }>(
      this.apiUrl + `/${roadId}/services/parking_lorry`
    );
  }

  getAllWebcams(roadId: string): Observable<{ webcams: any[] }> {
    return this.http.get<{ webcams: any[] }>(
      this.apiUrl + `/${roadId}/services/webcam`
    );
  }

  //DETAILS

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
  ): Observable<{ chargingDetails: BaseObject }> {
    return this.http.get<{ chargingDetails: BaseObject }>(
      this.apiUrl + `/details/electric_charging_station/${stationId}`
    );
  }

  getParkingDetails(
    parkingId: string
  ): Observable<{ parkingDetails: BaseObject }> {
    return this.http.get<{ parkingDetails: BaseObject }>(
      this.apiUrl + `/details/parking_lorry/${parkingId}`
    );
  }

  getWebcamDetails(
    webcamId: string
  ): Observable<{ webcamDetails: BaseObject }> {
    return this.http.get<{ webcamDetails: BaseObject }>(
      this.apiUrl + `/details/webcam/${webcamId}`
    );
  }

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
