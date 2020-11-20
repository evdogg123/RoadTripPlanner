import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { TripsService } from 'src/app/trips.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'ProjectUI';
  get loggedIn():boolean{
    return this.authSvc.loggedIn;
  }
  constructor(public authSvc:AuthService, public tripsSvc: TripsService) {
    console.log("trying to authorize....")
    authSvc.authorize();
  }

  signout(){
    this.authSvc.logout();
    this.tripsSvc.trips= [];
    return false;
  }
}
