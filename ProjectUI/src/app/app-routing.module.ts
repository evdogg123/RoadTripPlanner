import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AddprojectComponent } from './pages/addproject/addproject.component';
import { EditdetailsComponent } from './pages/editdetails/editdetails.component';
import {TripComponent} from './pages/trip/trip.component';
import {CalendarComponent} from './pages/calendar/calendar.component';
import { SubtripComponent } from './pages/subtrip/subtrip.component';


const routes: Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path:'home',component: HomeComponent},
  {path:'login',component: LoginComponent},
  {path:'register',component: RegisterComponent},
  {path:'addproject',component: AddprojectComponent},
  {path:'editdetails',component: EditdetailsComponent},
  {path:'trip/:tripID',component: TripComponent},
  {path:'trip/:tripID/:subtripID', component: SubtripComponent},
  {path:'trip/:tripID/calendar',component: CalendarComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
