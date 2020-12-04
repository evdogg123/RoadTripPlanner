import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'src/app/services/projects.service';
import { AgmCoreModule, GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-subtrip',
  templateUrl: './subtrip.component.html',
  styleUrls: ['./subtrip.component.scss']
})
export class SubtripComponent implements OnInit {
  tripID;
  subTripID;
  tripData;
  currentSubtrips = [];

  lat = null;
  lng = null;
  marklat = null;
  marklng = null;

  searchBar: any;

  zoom = 1;
  private geoCoder;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(private route: ActivatedRoute, private tripSvc: ProjectsService, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private router: Router) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log(params.get('tripID'));

      this.tripID = params.get('tripID')
      this.subTripID = params.get('subtripID');

      console.log(params);


      //NEED TO MAKE API CALL TO GET ALL DATA ASSOCIATED WITH
      //THIS SUBTRIP I.E
      // this.tripSvc.getSubTrip(params.get(subTripID))

      this.tripSvc.getTrip(params.get('tripID'))
        .subscribe(res => {
          console.log(res);
          this.tripData = res.data;


          //Just has first subtrip for now... how interact with subtrip ID?
          console.log(this.tripData.subTrips[0]);
          this.lat = this.tripData.subTrips[0].geometry.location.lat;
          this.lng = this.tripData.subTrips[0].geometry.location.lng;
        });

      

      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder;

        const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ["establishment"]
        });

        
        //Need to get locations near the current location
        //autocomplete.bindTo("bounds", this.searchElementRef.nativeElement);


        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();

            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            this.currentSubtrips.push(place);

            //set latitude, longitude and zoom
            this.marklat = place.geometry.location.lat();
            this.marklng = place.geometry.location.lng();
            console.log(place.name);
            this.zoom = 12;
          });
        });
      });

    });
  }

  goBack() {
    console.log("go back");
    this.router.navigate(["/trip/" + this.tripID]);
  }

  addSubtrip() {
    console.log("Add subtrip");
    console.log(this.currentSubtrips);
  }
}
