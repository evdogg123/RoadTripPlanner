import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddTripService } from 'src/app/services/add-trip.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { TripsService } from 'src/app/trips.service';
import { AlertService } from '../../elements/_alert';


import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.scss']
})
export class AddTripComponent implements OnInit {
  private path = 'http://localhost:3000/api/trips/'
  tripForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;
  tripId: string;

  options = {
    autoClose: true,
    keepAfterRouteChange: false
};



  constructor(public tripsSvc: TripsService, protected alertService: AlertService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private projSvc:ProjectsService, public addtripSvc: AddTripService) { }

  ngOnInit(): void {
    
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    this.tripForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [(tomorrow), Validators.required]
      
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

createTrip() {
  this.loading = true; 
  this.submitted=true;
  if (!this.tripForm.valid){
    this.loading = false; 
    return false;
  }
  console.log("Creating a Trip.....");
  console.log(this.tripForm.value);
  this.projSvc.addTrips(this.tripForm.value).subscribe(result=>{
    console.log(result);
    this.tripId = result.id;
    console.log(this.tripId);
    this.alertService.success('Trip Created.  Redirecting to home...', this.options);
    setTimeout(() =>{
      this.router.navigateByUrl("/home");
      this.projSvc.getTrips().subscribe(result=>{
        console.log(result.data);
        this.tripsSvc.trips=result.data;
      });
      this.addtripSvc.show_box = false; 
      this.loading = false; 
      this.submitted = false; 
      this.tripForm.reset(); 
    }, 2000);
  });
}

}
