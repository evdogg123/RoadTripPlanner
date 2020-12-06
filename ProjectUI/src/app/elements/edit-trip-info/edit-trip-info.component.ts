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
  state;
  



  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private projSvc:ProjectsService, public edittripSvc: EditTripInfoService) { }

  ngOnInit(): void {
    this.tripId = ''; 
    
    this.tripForm = this.edittripSvc.tripForm;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  

editTrip() {
  console.log("Edit Trip.....");
  //this.updating = true;
  console.log(this.tripForm.value.name);
  this.projSvc.editTrip({name:this.tripForm.value.name, description:this.tripForm.value.description}, this.tripId).subscribe(result =>{
    console.log(result);
  })
}

}
