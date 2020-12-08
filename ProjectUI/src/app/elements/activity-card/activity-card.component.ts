import { Component, OnInit, Input } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { SubtripService } from 'src/app/subtrip.service';
import { TripsService } from 'src/app/trips.service';
import { AlertService } from '../_alert';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss']
})
export class ActivityCardComponent implements OnInit {
  @Input() activity;
  del_confirm: boolean = false;
  is_food: boolean = false; 
  is_lodging: boolean = false; 
  is_tourist: boolean = false; 

  constructor(protected alertService: AlertService,
    private projSvc:ProjectsService,
    public subtripSvc: SubtripService,) { }

  ngOnInit(): void {
    let types = this.activity.types; 
    for (var i = 0; i < types.length; i++) {
        if (types[i] == "food") {
          this.is_food = true; 
        }
        if (types[i] == "lodging") {
          this.is_lodging = true; 
        }
        if (types[i] == "tourist_attraction") {
          this.is_tourist = true;
        }
    }


  }

  clickDelete() {
    this.del_confirm = true; 
  }

  cancelDelete() {
    this.del_confirm = false; 
  }

  deleteActivity(activityID){
  
     this.projSvc.deleteActivity({ Name: activityID}, this.subtripSvc.tripID, this.subtripSvc.subtripID)
     .subscribe(() => this.projSvc.getTrip(this.subtripSvc.tripID)
     .subscribe(
       res => {
         

         this.alertService.success("Activity deleted", {autoClose: true}); 

       }
     ));
      this.del_confirm = false; 
  }

}
