/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'src/app/services/projects.service';
import { CalendarComponent } from "../calendar/calendar.component";


@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss']
})
export class TripComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  @ViewChild(CalendarComponent) calendar: CalendarComponent;

  //Google maps member variables
 
  map: google.maps.Map;
  bounds: google.maps.LatLngBounds;
  input: any;
  searchBox: any;

  markers: google.maps.Marker[] = []; //temp, returned by search
  savedMarkers: google.maps.Marker[] = []; //saved, populated by backend
  trip;
  tripID;
  savedPlaces: any[];

  //currentSelected Location is what appears in the location info bar on the right side
  currentSelectedPlace: any;
  currentSelectedColor: any;

 
  //Front-end HTML logic
  saveLocButtonVisible = false;
  planTripButtonVisible = false;
  openedCalendar = false;
  openedLocInfo = false;
  showLocation = false;
  deleteButtonVisible = false;





  constructor(private route: ActivatedRoute, private tripSvc: ProjectsService, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log(params.get('tripID'));
      this.tripSvc.getTrip(params.get('tripID'))
        .subscribe(res => {
          console.log(res);

          this.trip = res.data;
          this.savedPlaces = this.trip["subTrips"];
          console.log(this.savedPlaces);
          this.tripID = params.get('tripID');
        });
    });

  }

  ngAfterViewInit() {
    this.createGoogleMap();
    //Wait for google map to finish loading before trying to initialize data
    setTimeout(() => {
      this.initSavedSubTripData();
    }, 3000);

  }

  createGoogleMap(){
    /*
    Initializes the google map with an integrated search box listening for user input
    */
    let mapProp = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.input = document.getElementById("pac-input") as HTMLInputElement;
    this.searchBox = new google.maps.places.SearchBox(this.input);
    document.getElementById("googleMap").children[0].setAttribute("style", "height: 100%; width: 100%; position: absolute; top: 0px; left: 0px; background-color: rgb(229, 227, 223); overflow:hidden;");
    this.map.addListener("bounds_changed", () => {
      this.searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    });
    this.searchBox.addListener("places_changed", () => {
      const places = this.searchBox.getPlaces();
      this.handlePlaceSearch(places);
      if (places.length == 0) {
        return;
      }
    });
  }



  initMarkerListeners() {
    //Listens for clicks on icons to display information about the saved location
    this.savedMarkers.forEach(savedMarker => {
      savedMarker.addListener('click', () => {
        this.markerClickHandler(savedMarker);
      });
    });
  }

  markerClickHandler(marker: google.maps.Marker) {
    this.savedPlaces.forEach(place => {
      if (place["geometry"]["location"]["lat"] == marker.getPosition().lat() &&
        place["geometry"]["location"]["lng"] == marker.getPosition().lng()) {
        this.createInfoBar(place, true);
        if (!this.openedLocInfo) {
          this.ToggleLocInfo();

        }
      }
    });
  }

  createInfoBar(place: any, saved: boolean) {
    //Populates the data from the right side bar with information about the location
    //Handles both saved locations and locations returned by the user's search
    this.currentSelectedPlace = place;
    console.log(place);
    let photoUrl = this.getPhotoUrl(place, saved);
    document.getElementById('locImg').setAttribute('src', photoUrl);
    if (saved) {
      this.planTripButtonVisible = true;
      this.saveLocButtonVisible = false;
      this.deleteButtonVisible = true;
    }
    else {
      this.planTripButtonVisible = false;
      this.saveLocButtonVisible = true;
    }
  }

  initSavedSubTripData() {
    /*
    Initializes data from the backend and displays it on the map
    -Creates markers, and resizes the bounds to fit all of the saved locations
    */
    const bounds = new google.maps.LatLngBounds();
    let icon: any;
    this.savedPlaces.forEach(savedPlace => {
      if (savedPlace["color"]) {
        icon = this.createIcon(savedPlace["color"]);
      }
      else {
        icon = {
          url: savedPlace.icon as string,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

      }

      this.savedMarkers.push(
        new google.maps.Marker({
          map: this.map,
          icon,
          title: savedPlace.name,
          position: savedPlace.geometry.location,
        })
      );


      if (savedPlace.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(savedPlace.geometry.viewport);
      } else {
        bounds.extend(savedPlace.geometry.location);
      }
      this.map.fitBounds(bounds, 0);
      this.map.setZoom(8);
    });
    this.initMarkerListeners();
  }



  handlePlaceSearch(places: any) {
    /*
    Triggered when user selects a location from the search bar
    -Creates and populates the left side bar with information about the place
    -Adds a temporary Marker with a randomly generated color
    -Resizes the maps bounds to include this new location
    */
    let place = places[0]; //Using first result of search if there are multiple results
    console.log(place);
    const bounds = new google.maps.LatLngBounds();
    this.clearTempMarkers();
    if (!this.isValidSearch(place)) {
      return;
    }
    this.currentSelectedPlace = null;
    this.currentSelectedPlace = place;
    let photoUrl = this.getPhotoUrl(place, false);
    place["photoUrl"] = photoUrl;

    this.createInfoBar(place, false);
    this.currentSelectedColor = this.getColor();
    let color = this.getColor();
    let icon = this.createIcon(color);
    this.markers.push(
      new google.maps.Marker({
        map: this.map,
        icon,
        title: place.name,
        position: place.geometry.location,
      })
    );
    if (place.geometry.viewport) {
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
    this.map.fitBounds(bounds);
    this.map.setZoom(8);
    if (!this.openedLocInfo) {
      this.ToggleLocInfo();

    }

  }

  /*
  ****************
  ROUTING/API FUNCTIONS
  ****************
  */


  saveLocation() {
    this.currentSelectedPlace["color"] = this.currentSelectedColor;
    console.log(this.currentSelectedPlace);
    console.log("Trip id: " + this.tripID);

    this.tripSvc.addSubTrip(this.currentSelectedPlace, this.tripID);
  }

  planTrip() {
    console.log("GOTO SubTrip planning page");
    this.router.navigate(['/trip/' + this.tripID + '/' + this.currentSelectedPlace["place_id"]])

  }


  /*
  ****************
  HELPER FUNCTIONS
  ****************
  */
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
  createIcon(color: string) {
    let icon = {
      path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
      fillColor: color,
      fillOpacity: .8,
      anchor: new google.maps.Point(0, 0),
      strokeWeight: 0,
      scale: 1
    }
    return icon;
  }

  getColor() {
    return "hsl(" + 360 * Math.random() + ',' +
      100 + '%,' +
      50 + '%)'
  }
  getPhotoUrl(place: any, saved: boolean) {
    if (saved) {
      return place["photoUrl"];
    }
    else {
      return place.photos[0].getUrl({ maxWidth: 500, maxHeight: 500 });
    }
  }
  clearTempMarkers() {
    this.markers.forEach((marker) => {
      console.log(marker);
      marker.setMap(null);
    });
    this.markers = [];
  }

  /*
  ****************
  ANIMATION FUNCTIONS
  ****************
  */
  expandCalendar() {
    if (this.openedCalendar) {
      document.getElementById("calendarBar").animate([
        // keyframes
        { left: '-675px' }
      ], {
        // timing options
        duration: 1000,
        fill: "both",
        easing: "ease-out"
      });
      this.openedCalendar = false;
    }
    else {
      document.getElementById("calendarBar").animate([
        // keyframes

        { left: '0px' }
      ], {
        duration: 1000,
        fill: "both",
        easing: "ease-out"
      });
      this.openedCalendar = true;
    }

  }
  ToggleLocInfo() {
    if (this.openedLocInfo) {
      document.getElementById("infoBar").animate([
        // keyframes
        { right: '-22%' },
      ], {
        duration: 1000,
        fill: "both",
        easing: "ease-out"
      });
    }
    else {
      document.getElementById("infoBar").animate([
        // keyframes
        { right: "0%" }
      ], {
        duration: 1000,
        fill: "both",
        easing: "ease-out",
      });

    }
    this.openedLocInfo = !this.openedLocInfo;
  }



deleteSubTrip(){
  console.log(this.currentSelectedPlace.name);
  console.log("Trip id: " + this.tripID);
  this.tripSvc.deleteSubTrip({Name:this.currentSelectedPlace.place_id}, this.tripID);
}

  
}
