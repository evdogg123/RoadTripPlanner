import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { TripsService } from './trips.service';

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
  constructor(public authSvc:AuthService, public tripSvc:TripsService) {
    console.log("trying to authorize....")
    authSvc.authorize();
  }

  signout(){
    this.authSvc.logout();
    this.tripSvc.trips.length = 0; // this is a bit of workaround to make it seem 
                                   // like the page is refreshing on sign-out
    return false;
  }
}
