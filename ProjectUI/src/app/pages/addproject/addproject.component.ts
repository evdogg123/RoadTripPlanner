import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-addproject',
  templateUrl: './addproject.component.html',
  styleUrls: ['./addproject.component.scss']
})
export class AddprojectComponent implements OnInit {
  private path = 'http://localhost:3000/api/trips/'
  tripForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;
  tripId: string;



  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private projSvc:ProjectsService) { }

  ngOnInit(): void {
    this.tripForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

createTrip() {
  console.log("Creating a Trip.....");
  console.log(this.tripForm.value);
  this.projSvc.addTrips(this.tripForm.value).subscribe(result=>{
    console.log(result);
    this.tripId = result.id;
    console.log(this.tripId);
    this.router.navigateByUrl("/trip/" + this.tripId);
    //this.router.navigate(["/trip/" + this.tripId]);
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
