import { Component, OnInit } from '@angular/core';
import { AddTripService } from 'src/app/services/add-trip.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { TripsService } from 'src/app/trips.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private projSvc:ProjectsService, public authSvc:AuthService, public tripsSvc: TripsService, public addtripSvc: AddTripService) { 

  }

  ngOnInit(): void {
    this.projSvc.getTrips().subscribe(result => {
      console.log(result.data);
      this.tripsSvc.trips=result.data;
    })
  }

}
