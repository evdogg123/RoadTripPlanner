import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss']
})
export class ActivityCardComponent implements OnInit {
  @Input() activity;
  del_confirm: boolean = false;

  constructor() { }

  ngOnInit(): void {

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
    // }));
      this.del_confirm = false; 
  }

}
