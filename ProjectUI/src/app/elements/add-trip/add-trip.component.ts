import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddTripService } from 'src/app/services/add-trip.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { AlertService } from '../../elements/_alert';

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



  constructor(protected alertService: AlertService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private projSvc:ProjectsService, public addtripSvc: AddTripService) { }

  ngOnInit(): void {
    this.tripForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
      
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

createTrip() {
  this.submitted=true;
  if (!this.tripForm.valid){
    return false;
  }
  console.log("Creating a Trip.....");
  console.log(this.tripForm.value);
  this.projSvc.addTrips(this.tripForm.value).subscribe(result=>{
    console.log(result);
    this.tripId = result.id;
    console.log(this.tripId);
    //this.router.navigateByUrl("/home");
    this.alertService.success('Trip Created.  Redirecting to home...', this.options);
    setTimeout(() =>{
      this.router.navigateByUrl("/home");
    }, 3500);
    // this.router.navigateByUrl("/trip/" + this.tripId);
    // this.router.navigate(["/trip/" + this.tripId]);
    this.addtripSvc.show_box = false; 
  });
  //console.log(this.tripId);
  //this.router.navigateByUrl("/trip/" + this.tripId);
/*

    
    this.submitted = true;
    if (this.tripForm.invalid) {
      console.log("Invalid");
      return;
    }


    console.log(this.tripForm);
    this.loading = true;
    console.log(this.http);
    this.http.post<any>(this.path, { name: this.tripForm.controls.name.value, description: this.tripForm.controls.description.value })
    .subscribe(data => console.log('success', data),
      error => console.log('oops', error));

*/
}

}
