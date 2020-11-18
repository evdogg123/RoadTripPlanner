import { Component, Input, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { TripsService } from 'src/app/trips.service';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.scss']
})
export class TripCardComponent implements OnInit {
  @Input() trip;
  img; 

  constructor(private projSvc:ProjectsService, public tripsSvc: TripsService) { 

  }

  ngOnInit(): void {
    if (this.trip.subTrips.length > 0) { 
      this.img = this.getPhotoUrl(this.trip.subTrips[0], true);
    } else {
      this.img = null; 
    }
  }

  deleteTrip(id){
    console.log("Trip id: " + id);
    this.projSvc.deleteTrip(id, id).subscribe(res => this.projSvc.getTrips().subscribe(result=>{
      console.log(result.data);
      this.tripsSvc.trips=result.data;
    }));
  }

  getPhotoUrl(place: any, saved: boolean) {
    if (saved) {
      return place["photoUrl"];
    }
    else {
      return place.photos[0].getUrl({ maxWidth: 500, maxHeight: 500 });
    }
  }

}