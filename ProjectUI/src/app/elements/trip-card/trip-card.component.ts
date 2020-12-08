import { Component, Input, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { TripsService } from 'src/app/trips.service';
import { Router } from '@angular/router';
import { EditTripInfoService } from 'src/app/services/edit-trip-info.service';
import { AlertService } from '../_alert';


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

  constructor(private projSvc:ProjectsService, 
    public tripsSvc: TripsService, 
    private router: Router, 
    public edittripSvc: EditTripInfoService, 
    protected alertService: AlertService) { 

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
      this.alertService.error("Trip deleted: " + this.trip.name, {autoClose: true}); 
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

  editTrip(id, name, description, startDate, endDate){
    this.edittripSvc.updateData(id, name, description, startDate, endDate);
    console.log(this.edittripSvc.tripId, this.edittripSvc.name, this.edittripSvc.description, this.edittripSvc.startDate, this.edittripSvc.endDate)
    this.edittripSvc.changeContent();
    
  }

}