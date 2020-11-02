import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  trips=[];

  constructor(private projSvc:ProjectsService) { 

  }

  ngOnInit(): void {
    this.projSvc.getTrips().subscribe(result=>{
      console.log(result.data);
      this.trips=result.data;
      
    })
  }

}
