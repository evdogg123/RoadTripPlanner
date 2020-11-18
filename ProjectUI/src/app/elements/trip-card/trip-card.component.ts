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

  constructor(private projSvc:ProjectsService, public tripsSvc: TripsService) { 

  }

  ngOnInit(): void {
  }

  deleteTrip(id){
    console.log("Trip id: " + id);
    this.projSvc.deleteTrip(id, id);
    this.projSvc.getTrips().subscribe(result=>{
      console.log(result.data);
      this.tripsSvc.trips=result.data;
    });
  }

}