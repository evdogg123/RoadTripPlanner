import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-subtrip',
  templateUrl: './subtrip.component.html',
  styleUrls: ['./subtrip.component.scss']
})
export class SubtripComponent implements OnInit {
  tripID;
  subTripID;

  constructor(private route: ActivatedRoute, private tripSvc: ProjectsService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log(params.get('tripID'));
      this.tripID = params.get('tripID')
      this.subTripID = params.get('subtripID');

      //NEED TO MAKE API CALL TO GET ALL DATA ASSOCIATED WITH
      //THIS SUBTRIP I.E
      // this.tripSvc.getSubTrip(params.get(subTripID))
    
    });
  }

}
