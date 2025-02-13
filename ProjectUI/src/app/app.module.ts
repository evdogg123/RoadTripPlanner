import { BrowserModule } from '@angular/platform-browser';
import { NgModule, } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { TripComponent } from './pages/trip/trip.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, } from 'angular-calendar';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, } from 'date-fns';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MatSidenavModule, } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SubtripComponent } from './pages/subtrip/subtrip.component';
import { TripCardComponent } from './elements/trip-card/trip-card.component';
import { AlertModule } from './elements/_alert';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { AddTripComponent } from './elements/add-trip/add-trip.component';
import { EditTripInfoComponent } from './elements/edit-trip-info/edit-trip-info.component';
import { ActivityCardComponent } from './elements/activity-card/activity-card.component';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    TripComponent,
    CalendarComponent,
    SubtripComponent,
    TripCardComponent,
    AddTripComponent,
    EditTripInfoComponent,
    ActivityCardComponent,
  ],
  imports: [
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyD0xQbma77tUGQYTH32GR7UJKatgV3vjl0',
    //   libraries: ['places', 'directions']
    // }),
    FormsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    NgxSpinnerModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DragDropModule,
    MatButtonToggleModule,
    NgbModule,
    MatMenuModule,
    NgbModalModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,

    }),
    AlertModule


  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
