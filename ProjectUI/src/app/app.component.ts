import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { TripsService } from 'src/app/trips.service';
import { AddTripService } from './services/add-trip.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'ProjectUI';
  add_trip: boolean; 
  get loggedIn():boolean{
    return this.authSvc.loggedIn;
  }
  constructor(public authSvc:AuthService, public tripsSvc: TripsService, public addtripSvc: AddTripService) {
    console.log("trying to authorize....")
    authSvc.authorize();
  }

  signout(){
    this.authSvc.logout();
    this.tripsSvc.trips= [];
    this.tripsSvc.trips.length = 0; // this is a bit of workaround to make it seem 
                                   // like the page is refreshing on sign-out
    return false;
  }
}
