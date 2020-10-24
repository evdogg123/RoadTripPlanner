import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private path="http://localhost:3000/api/trips/"
  constructor(private http:HttpClient) { }

  getTrips(): Observable<any>{
    return this.http.get(this.path);
  }
  addTrips(data: any){
    return this.http.post<any>(this.path, data).subscribe(res => console.log('success', res));
    
  }
  
}
