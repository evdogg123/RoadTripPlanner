import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditTripInfoService } from 'src/app/services/edit-trip-info.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { AlertService } from '../../elements/_alert';
import { TripsService } from 'src/app/trips.service';

@Component({
  selector: 'app-edit-trip-info',
  templateUrl: './edit-trip-info.component.html',
  styleUrls: ['./edit-trip-info.component.scss']
})
export class EditTripInfoComponent implements OnInit {
  private path = 'http://localhost:3000/api/trips/'
  tripForm: FormGroup;
  updating = false;
  submitted = false;
  returnUrl: string;
  error: string;
  tripId: string;
  state;
  options = {
    autoClose: true,
    keepAfterRouteChange: false}
  



  constructor(private formBuilder: FormBuilder, protected alertService: AlertService, private route: ActivatedRoute,
     private router: Router, private projSvc:ProjectsService, public edittripSvc: EditTripInfoService, public tripsSvc: TripsService,) { }

  ngOnInit(): void {
    this.tripId = ''; 
    
    this.tripForm = this.edittripSvc.tripForm;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  

editTrip() {
  console.log("Edit Trip.....");
  //this.updating = true;
  console.log(this.tripForm.value.name);
  this.projSvc.editTrip({name:this.tripForm.value.name, description:this.tripForm.value.description}, this.edittripSvc.tripId).subscribe(result =>{
    console.log(result);
    this.alertService.success('Trip Updates.  Redirecting to home...', this.options);
    setTimeout(() =>{
      this.router.navigateByUrl("/home");
      this.projSvc.getTrips().subscribe(result=>{
        console.log(result.data);
        this.tripsSvc.trips=result.data;
      });
      this.edittripSvc.show_box = false; 
      this.updating = false; 
      this.submitted = false; 
      this.tripForm.reset(); 
    }, 2000);
    
  })
}

}
