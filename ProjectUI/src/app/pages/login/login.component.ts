import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from '../../elements/_alert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading =false;
  submitted=false;
  returnUrl: string;
  error: string;
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  constructor(protected alertService: AlertService, private formBuilder: FormBuilder,private route: ActivatedRoute,private router: Router,private authSvc:AuthService) {
      if (authSvc.loggedIn)
      this.router.navigate(['/']);
   }

  ngOnInit(): void {
    this.loginForm=this.formBuilder.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    });
    this.returnUrl=this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(){
    this.submitted=true;
    if (this.loginForm.invalid){
      return;
    }
    this.loading=true;
    this.authSvc.login(this.loginForm.controls.username.value,this.loginForm.controls.password.value).subscribe(response=>{
      this.router.navigate([this.returnUrl]);
    },err=>{
      this.submitted=false;
      this.loading=false;
      if(err == "Http failure response for http://localhost:3000/api/security/login: 401 Unauthorized"){
        this.alertService.error('Incorrect username or password', this.options);
      }
      else{
        this.alertService.error('Login failed', this.options);
      }
      //this.error=err.message||err;
    });
  }
}
