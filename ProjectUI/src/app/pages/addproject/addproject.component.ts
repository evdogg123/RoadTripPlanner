import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-addproject',
  templateUrl: './addproject.component.html',
  styleUrls: ['./addproject.component.scss']
})
export class AddprojectComponent implements OnInit {
  private path='http://localhost:3000/api/semesters/'
  tripForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private http:HttpClient) { }

  ngOnInit(): void {
    this.tripForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }
  createTrip() {
    console.log("Creating a Trip.....");
    this.submitted=true;
    if (this.tripForm.invalid){
      console.log("Invalid user/password");
      return;
    }
    this.loading = true;
    return this.http.post<any>(this.path,{name:this.tripForm.controls.name, password: this.tripForm.controls.password })

  }

}
