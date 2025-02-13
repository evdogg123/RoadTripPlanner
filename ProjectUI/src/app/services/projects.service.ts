import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private path = "http://localhost:3000/api/trips/"
  constructor(private http: HttpClient) { }

  getTrips(): Observable<any> {
    return this.http.get(this.path);
  }
  addTrips(data: any): Observable<any> {
    return this.http.post<any>(this.path, data);//.subscribe(res => console.log('success', res));
  }
  addSubTrip(data: any, tripId: string) {
    return this.http.post<any>(`${this.path}trip/${tripId}`, data).subscribe(res => console.log('success', res));
  }
  getTrip(tripId: string): Observable<any> {
    return this.http.get(`${this.path}trip/${tripId}`);
  }
  deleteTrip(data: any, tripId: string) {
    return this.http.delete(`${this.path}trip/${tripId}`, data);
  }
  deleteSubTrip(data: any, tripId: string) {
    return this.http.put(`${this.path}trip/${tripId}`, data);
  }
  editTrip(data: any, tripId: string) {
    return this.http.put(`${this.path}trip/${tripId}/edit`, data)//.subscribe(res => console.log('success', res));
  }
  editSubTrip(data: any, tripId: string) {
    return this.http.put(`${this.path}trip/${tripId}/editSubTrip`, data)//.subscribe(res => console.log('success', res));
  }
  updateCenter(data: any, tripID: string) {
    return this.http.post<any>(`${this.path}trip/${tripID}/center`, data).subscribe(res => console.log('success', res));
  }
  getLocationSummary(data: string) {
    return this.http.get(`${this.path}wikiSearch/${data}`);
  }
  addActivity(data: any, tripId: string, subTripId: string) {
    return this.http.put(`${this.path}trip/${tripId}/${subTripId}`, data);
  }
  getSubTrip(tripId: string, subTripId: string) {
    return this.http.get(`${this.path}trip/${tripId}/${subTripId}`);
  }
}

