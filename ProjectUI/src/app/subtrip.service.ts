import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubtripService {
  data: any ;
  tripID;
  subtripID;

  constructor() { }
  setIDs(tripID:string, subTripID:string){
    this.tripID = tripID;
    this.subtripID = subTripID;
  }

  setData(data){
    this.data =data;
  }
}
