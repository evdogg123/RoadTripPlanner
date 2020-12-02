import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from '../../elements/_alert';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  signupForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;
<<<<<<< HEAD
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  constructor(protected alertService: AlertService, private formBuilder: FormBuilder,private route: ActivatedRoute,private router: Router,private authSvc:AuthService) { }
=======
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authSvc: AuthService) { }
>>>>>>> 9525a3e78f6c25f0ab3a2c3801ca5c89f37bbcb3

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  register(): void {
    this.submitted = true;
    if (this.signupForm.invalid) {
      console.log("Invalid user/password");
      return;
    }
    this.loading=true;
    this.authSvc.register(this.signupForm.controls.username.value,this.signupForm.controls.password.value).subscribe(response=>{
<<<<<<< HEAD
      console.log(response);
      this.router.navigate([this.returnUrl]);
    },err=>{
      this.submitted=false;
      this.loading=false;
      if(err == "Http failure response for http://localhost:3000/api/security/register: 400 Bad Request"){
        this.alertService.error('Sign up failed', this.options);
      }
      this.error=err.message||err;
    });
=======
      console.log("Account Creation successful, logging in");

      this.authSvc.login(this.signupForm.controls.username.value,this.signupForm.controls.password.value).subscribe(response=>{
        this.router.navigate([this.returnUrl]);
      },err=>{this.submitted=false;this.loading=false;this.error=err.message||err;});

    },err=>{this.submitted=false;this.loading=false;this.error=err.message||err;});

>>>>>>> 9525a3e78f6c25f0ab3a2c3801ca5c89f37bbcb3
  }

}
