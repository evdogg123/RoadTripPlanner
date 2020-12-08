import { Component, OnInit, Input } from '@angular/core';
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

  constructor(protected alertService: AlertService) { }

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

  deleteActivity(id){
    // this.projSvc.deleteTrip(id, id).subscribe(res => this.projSvc.getTrips().subscribe(result=>{
      // console.log(result.data);
      // this.tripsSvc.trips=result.data;
      this.alertService.error("Activity deleted: " + this.activity.name, {autoClose: true}); 
    // }));
      this.del_confirm = false; 
  }

}
