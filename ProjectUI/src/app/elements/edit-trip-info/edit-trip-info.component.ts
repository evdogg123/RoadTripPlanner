import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditTripInfoService } from 'src/app/services/edit-trip-info.service';
import { ProjectsService } from 'src/app/services/projects.service';

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
  name: string;
  description: string;
  state;
  



  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private projSvc:ProjectsService, public edittripSvc: EditTripInfoService) { }

  ngOnInit(): void {
    this.tripId = window.history.state.tripId; 
    this.name = window.history.state.name;
    this.description = window.history.state.description;
    this.tripForm = this.formBuilder.group({
      name: [window.history.state.name, Validators.required],
      description: [window.history.state.description, Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

editTrip() {
  console.log("Edit Trip.....");
  this.updating = true;
  //console.log(this.tripForm.value.name);
  this.projSvc.editTrip({name:this.tripForm.value.name, description:this.tripForm.value.description}, this.tripId).subscribe(result =>{
    console.log(result);
    this.router.navigateByUrl("/home");
  })
}

}
