import { Component, Input, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.scss']
})
export class TripCardComponent implements OnInit {
  @Input() trip;

  constructor(private projSvc:ProjectsService) { 

  }

  ngOnInit(): void {
  }

  deleteTrip(id){
    console.log("Trip id: " + id);
    this.projSvc.deleteTrip(id, id);
    this.projSvc.getTrips().subscribe(result=>{
      console.log(result.data);
      // this.trip=result.data;
    });
  }

}
