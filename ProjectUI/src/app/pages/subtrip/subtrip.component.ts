/// <reference types="@types/googlemaps" />
import { Component, OnInit, ElementRef, ViewChild, NgZone  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'src/app/services/projects.service';
import { AgmCoreModule, GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
const MARKER_PATH =
  "https://developers.google.com/maps/documentation/javascript/images/marker_green";
const hostnameRegexp = new RegExp("^https?://.+?/");


@Component({
  selector: 'app-subtrip',
  templateUrl: './subtrip.component.html',
  styleUrls: ['./subtrip.component.scss']
})
export class SubtripComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  //@ViewChild('search');
  tripID;
  subTripID;
  tripData;
  currentSubtrips = [];

  lat = null;
  lng = null;
  map: google.maps.Map;
  bounds = new google.maps.LatLngBounds();
  input: any;
 places: google.maps.places.PlacesService;
  searchBox: any;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer;
  markers: google.maps.Marker[] = []; //temp, returned by search
  savedMarkers: google.maps.Marker[] = []; //saved, populated by backend
  trip;
  infoWindow: google.maps.InfoWindow;
  mapBounds:any;
  savedPlaces: any[];
  initialCenter: any;
  destination: any;
  searchBar: any;
  subTripLocation: any;
  activities: any
  zoom = 1;
  private geoCoder;
  state$: Observable<object>;
  currentSelectedMarkerInfo: any;

 
  public searchElementRef: ElementRef;


  constructor(private route: ActivatedRoute, private tripSvc: ProjectsService, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private router: Router) { }

  /*
    Initializes the google map with an integrated search box listening for user input
    */
   createGoogleMap(){
    console.log(this.subTripLocation);
    if (this.subTripLocation){
      this.initialCenter = this.subTripLocation.geometry.location;
    }
    else{
      this.initialCenter = {lat:20,lng:20};
    }
    let mapProp = {
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: this.initialCenter,
      restriction: {
        latLngBounds: this.subTripLocation.geometry.viewport,
        strictBounds: false,
      },
    };
    console.log(this.gmapElement);
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.directionsRenderer = new google.maps.DirectionsRenderer({ map: this.map, suppressMarkers: true, preserveViewport: true });
    this.input = document.getElementById("pac-input") as HTMLInputElement;
    this.searchBox = new google.maps.places.SearchBox(this.input);
    this.places = new google.maps.places.PlacesService(this.map);
    this.infoWindow = new google.maps.InfoWindow({
      content: document.getElementById("info-content") as HTMLElement,
    });
    
    document.getElementById("googleMap").children[0].setAttribute("style", "height: 100%; width: 100%; position: absolute; top: 0px; left: 0px; background-color: rgb(229, 227, 223); overflow:hidden;");
    this.map.addListener("bounds_changed", () => {
      this.searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    });
    this.searchBox.addListener("places_changed", () => {
      const places = this.searchBox.getPlaces();
      this.handleSearch(places);
      if (places.length == 0) {
        return;
      }
    });
    setTimeout(() => {
      this.search("restaurant");
    }, 2000);
    
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log(params.get('tripID'));

      this.tripID = params.get('tripID')
      this.subTripID = params.get('subtripID');
      console.log(params);
    });
    
    console.log(history.state);
    this.subTripLocation = history.state.data;
    console.log(this.subTripLocation);
  
  }

  ngAfterViewInit(){
    this.createGoogleMap();
  }
  handleSearch(places: any){
    
    let place = places[0]; //Using first result of search if there are multiple results
    console.log(place);
    const bounds = new google.maps.LatLngBounds();
    if (!this.isValidSearch(place)) {
      return;
    }
    this.markers.push(
      new google.maps.Marker({
        map: this.map,
        title: place.name,
        position: place.geometry.location,
      })
    );
    if (place.geometry.viewport) {
      this.bounds.union(place.geometry.viewport);
    } else {
      this.bounds.extend(place.geometry.location);
    }
    console.log(this.bounds);
    this.map.setCenter(this.bounds.getCenter());

  }

  search(type:string){
    console.log(this.map.getBounds());
    const search = {
      bounds: this.map.getBounds() as google.maps.LatLngBounds,
      // types: ["lodging"],
      types:[type]
    };
    this.places.nearbySearch(
      search,
      (
        results: google.maps.places.PlaceResult[],
        status: google.maps.places.PlacesServiceStatus,
        pagination: google.maps.places.PlaceSearchPagination
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // clearResults();
          // clearMarkers(); LATER
  
          // Create a marker for each hotel found, and
          // assign a letter of the alphabetic to each marker icon.
          for (let i = 0; i < results.length; i++) {
            const markerLetter = String.fromCharCode(
              "A".charCodeAt(0) + (i % 26)
            );
            const markerIcon = MARKER_PATH + markerLetter + ".png";
            // Use marker animation to drop the icons incrementally on the map.
            this.markers[i] = new google.maps.Marker({
              position: (results[i].geometry as google.maps.places.PlaceGeometry)
                .location,
              animation: google.maps.Animation.DROP,
              icon: markerIcon,
            });
            // If the user clicks a hotel marker, show the details of that hotel
            // in an info window.
            // @ts-ignore TODO(jpoehnelt) refactor to avoid storing on marker
           // this.markers[i].placeResult = results[i];
            // google.maps.event.addListener(markers[i], "click", showInfoWindow);
            setTimeout(this.dropMarker(i), i * 100);
            this.markers[i].addListener('click', () => {
            this.markerClickHandler(this.markers[i], results[i]);
            });
            this.addResult(results[i], i);
          }
        }
      }
    );

  }
  markerClickHandler(marker: google.maps.Marker,result: google.maps.places.PlaceResult ){
    console.log(marker);
    console.log(result);
    this.currentSelectedMarkerInfo = result;
    this.places.getDetails(
      { placeId:result.place_id },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        this.infoWindow.open(this.map, marker);
        this.buildIWContent(place);
      }
    );
  }

  clearResults() {
    const results = document.getElementById("results") as HTMLElement;
  
    while (results.childNodes[0]) {
      results.removeChild(results.childNodes[0]);
    }
  }

  clearMarkers() {
    for (let i = 0; i < this.markers.length; i++) {
      if (this.markers[i]) {
        this.markers[i].setMap(null);
      }
    }
    this.markers = [];
  }

  addResult(result, i) {
    const results = document.getElementById("results") as HTMLElement;
    const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
    const markerIcon = MARKER_PATH + markerLetter + ".png";
  
    const tr = document.createElement("tr");
    tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF";
    let marker = this.markers[i];
    tr.onclick = function () {
      google.maps.event.trigger(marker, "click");
    };


  
    const iconTd = document.createElement("td");
    const nameTd = document.createElement("td");
    const icon = document.createElement("img");
    icon.src = markerIcon;
    icon.setAttribute("class", "placeIcon");
    icon.setAttribute("className", "placeIcon");
    const name = document.createTextNode(result.name);
    iconTd.appendChild(icon);
    nameTd.appendChild(name);
    tr.appendChild(iconTd);
    tr.appendChild(nameTd);
    results.appendChild(tr);
  }

  buildIWContent(place) {
    (document.getElementById("iw-icon") as HTMLElement).innerHTML =
      '<img class="hotelIcon" ' + 'src="' + place.icon + '"/>';
    (document.getElementById("iw-url") as HTMLElement).innerHTML =
      '<b><a href="' + place.url + '">' + place.name + "</a></b>";
    (document.getElementById("iw-address") as HTMLElement).textContent =
      place.vicinity;
  
    if (place.formatted_phone_number) {
      (document.getElementById("iw-phone-row") as HTMLElement).style.display = "";
      (document.getElementById("iw-phone") as HTMLElement).textContent =
        place.formatted_phone_number;
    } else {
      (document.getElementById("iw-phone-row") as HTMLElement).style.display =
        "none";
    }
  
    // Assign a five-star rating to the hotel, using a black star ('&#10029;')
    // to indicate the rating the hotel has earned, and a white star ('&#10025;')
    // for the rating points not achieved.
    if (place.rating) {
      let ratingHtml = "";
  
      for (let i = 0; i < 5; i++) {
        if (place.rating < i + 0.5) {
          ratingHtml += "&#10025;";
        } else {
          ratingHtml += "&#10029;";
        }
        (document.getElementById("iw-rating-row") as HTMLElement).style.display =
          "";
        (document.getElementById(
          "iw-rating"
        ) as HTMLElement).innerHTML = ratingHtml;
      }
    } else {
      (document.getElementById("iw-rating-row") as HTMLElement).style.display =
        "none";
    }
  
    // The regexp isolates the first part of the URL (domain plus subdomain)
    // to give a short URL for displaying in the info window.
    if (place.website) {
      let fullUrl = place.website;
      let website = String(hostnameRegexp.exec(place.website));
  
      if (!website) {
        website = "http://" + place.website + "/";
        fullUrl = website;
      }
      (document.getElementById("iw-website-row") as HTMLElement).style.display =
        "";
      (document.getElementById(
        "iw-website"
      ) as HTMLElement).textContent = website;
    } else {
      (document.getElementById("iw-website-row") as HTMLElement).style.display =
        "none";
    }
  }


  onValChange(value){
    this.clearResults();
    this.clearMarkers();
    this.search(value);
}


 dropMarker(i) {
      this.markers[i].setMap(this.map);
  
  }
  
 
 isValidSearch(place: any) {

   if (!place.geometry) {
     alert("Invalid Location.");
     return false;
   }
   if (!place.types.includes("locality")) {
     alert("Invalid Location.");
     return false;
   }
   return true;
 }

 goBack() {
  console.log("go back");
  this.router.navigate(["/trip/" + this.tripID]);
}

saveActivity(){
  console.log("here");
  console.log(this.currentSelectedMarkerInfo);
  this.tripSvc.addActivity(this.currentSelectedMarkerInfo,this.tripID,this.subTripID)
    .subscribe(() => this.tripSvc.getTrip(this.tripID)
      .subscribe(
        res=> {this.trip = res["data"];
        console.log(res["data"]);
        this.subTripLocation = res["data"]["subTrips"].filter((item) => { return item.place_id == this.subTripID; })[0];
        console.log(this.subTripLocation);
      
      }
      ));
  }
}
