import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { TripsService } from 'src/app/trips.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private projSvc:ProjectsService, public tripsSvc: TripsService) { 

  }

  ngOnInit(): void {
    this.projSvc.getTrips().subscribe(result=>{
      console.log(result.data);
      this.tripsSvc.trips=result.data;
    })
  }

}
