import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EditTripInfoService {
  show_box: boolean;
  tripId;
  name: string;
  description:string;
  startDate: Date;
  endDate: Date;
  tripForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.tripForm = this.formBuilder.group({
      name: [this.name, Validators.required],
      description: [this.description, Validators.required],
      startDate: [this.startDate, Validators.required],
      endDate: [this.endDate, Validators.required]
    });
   }
   changeContent(){
    this.tripForm.patchValue({
      name: this.name, 
      description: this.description,
      startDate: this.startDate, 
      endDate: this.endDate
    });
  }

  updateData(new_tripId, new_name, new_description, new_start, new_end){
    this.tripId = new_tripId;
    this.name = new_name;
    this.description = new_description;
    this.startDate = new_start;
    this.endDate = new_end;
  }
}
