import { Component, Input, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { TripsService } from 'src/app/trips.service';
import { ActivatedRoute, Router } from '@angular/router';
import { setClassMetadata } from '@angular/core/src/r3_symbols';
import { $ } from 'protractor';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.scss']
})
export class TripCardComponent implements OnInit {
  @Input() trip;
  img; 
  del_confirm: boolean = false; 
  start_date; 
  end_date; 

  constructor(private projSvc:ProjectsService, public tripsSvc: TripsService, private router: Router) { 

  }

  ngOnInit(): void {
    if (this.trip.subTrips.length > 0) { 
      this.img = this.getPhotoUrl(this.trip.subTrips[0], true);
    } else {
      this.img = null; 
    }

    this.start_date = new Date(this.trip.startDate).toDateString(); 
    this.end_date = new Date(this.trip.endDate).toDateString(); 
  }

  clickDelete() {
    this.del_confirm = true; 
  }

  cancelDelete() {
    this.del_confirm = false; 
  }

  deleteTrip(id){
    console.log("Trip id: " + id);
    this.projSvc.deleteTrip(id, id).subscribe(res => this.projSvc.getTrips().subscribe(result=>{
      console.log(result.data);
      this.tripsSvc.trips=result.data;
    }));
      this.del_confirm = false; 
  }

  getPhotoUrl(place: any, saved: boolean) {
    if (saved) {
      return place["photoUrl"];
    }
    else {
      return place.photos[0].getUrl({ maxWidth: 500, maxHeight: 500 });
    }
  }

  editTrip(id, name, description){
    console.log("Trip id: " + id);
    this.router.navigate(["/editdetails"], {state: {"tripId" : id, "name": name, "description": description}});
    //this.router.navigate["/editdetails"]
  }

}