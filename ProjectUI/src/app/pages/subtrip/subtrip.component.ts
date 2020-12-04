import { Component, OnInit, ElementRef, ViewChild, NgZone  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  lat = null;
  lng = null;

  searchBar: any;

  zoom = 1;
  private geoCoder;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(private route: ActivatedRoute, private tripSvc: ProjectsService, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log(params.get('tripID'));

      this.tripID = params.get('tripID')
      this.subTripID = params.get('subtripID');

      console.log(params);

      
      //NEED TO MAKE API CALL TO GET ALL DATA ASSOCIATED WITH
      //THIS SUBTRIP I.E
      // this.tripSvc.getSubTrip(params.get(subTripID))
    
      
      this.mapsAPILoader.load().then(() => { 
        this.geoCoder = new google.maps.Geocoder;
  
        const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
        autocomplete.setTypes(["establishment"]);
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
  
            //set latitude, longitude and zoom
            this.lat = place.geometry.location.lat();
            this.lng = place.geometry.location.lng();
            console.log(place.name);
            this.zoom = 12;
          }); 
        });
      });

    });
  }

}
