/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from 'src/app/services/projects.service';
import { MapsAPILoader } from '@agm/core';
import { CalendarComponent } from "../calendar/calendar.component";

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss']
})
export class TripComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  @ViewChild(CalendarComponent) calendar: CalendarComponent;
  markers: google.maps.Marker[] = [];
  savedMarkers: google.maps.Marker[] = [];
  map: google.maps.Map;
  bounds: google.maps.LatLngBounds;
  trip;
  tripID;
  savedPlaces: any[];
  currentSelectedPlace: any;
  latitude: any;
  longitude: any;
  input: any;
  saveLocButton: any;
  searchBox: any;
  openedCalendar = false;
  openedLocInfo = false;

  showLocation = false;

  iconBase = 'https://maps.google.com/mpfiles/kml/shapes/';

  markerTypes = [
    {
      text: "Parking", value: "parking_lot_maps.png"
    }
  ];

  selectedMarkerType: string = "parking_lot_maps.png";
  isHidden = false;


  constructor(private route: ActivatedRoute, private tripSvc: ProjectsService) { }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log(params.get('tripID'));
      this.tripSvc.getTrip(params.get('tripID'))
        .subscribe(res => {
          this.trip = res.data;
          this.savedPlaces = this.trip["subTrips"];
          console.log(this.savedPlaces);
          this.tripID = params.get('tripID');
        });
    });

  }

  ngAfterViewInit() {
    let mapProp = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.input = document.getElementById("pac-input") as HTMLInputElement;
    this.saveLocButton = document.getElementById("saveLocButton") as HTMLInputElement;
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
    setTimeout(() => {
      this.initSavedSubTripData();
    }, 6000);

  }

  getPlaceImage(place: any) {
    let photoUrl = place.photos[0].getUrl({ maxWidth: 500, maxHeight: 500 });
    console.log(photoUrl);
    document.getElementById('locImg').setAttribute('src', photoUrl);
  }

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
        // timing optionse initial limit, the app will start failing. You can increase this limit free of charge, up to 150,000 requests per 24 hour period, by enabling billing on the Google API Console to verify your identity. A credit card is required for verification. We ask for your credit card purely to validate your identity. Your card will not be charged for use of the Google Places API Web Service.
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
        // timing options
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
        // timing options
        duration: 1000,
        fill: "both",
        easing: "ease-out",
      });

    }
    this.openedLocInfo = !this.openedLocInfo;

  }


  initSavedSubTripData() {
    const bounds = new google.maps.LatLngBounds();
    this.savedPlaces.forEach(savedPlace => {
      const icon = {
        url: savedPlace.icon as string,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      this.markers.push(
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
      console.log("BOUNDS");
      console.log(bounds);
      this.map.fitBounds(bounds, 0);
      this.map.setZoom(8);
    });
  }



  handlePlaceSearch(places: any) {
    const bounds = new google.maps.LatLngBounds();
    this.markers.forEach((marker) => {
      marker.setMap(null);
    });
    this.markers = [];

    if (places.length > 1) {
      console.warn("Multiple places returned by this search, choosing the first one.")
    }
    let place = places[0];
    console.log(place);
    this.getPlaceImage(place);
    if (!place.geometry) {
      //TODO: Make this display error to user
      console.warn("This place has no geometry attribute.");
      return;
    }
    if (!place.types.includes("locality")) {
      //TODO: Make this display error to user
      console.warn("This is not a valid geographical location");
      return;
    }
    // const icon = {
    //   url: place.icon as string,
    //   size: new google.maps.Size(71, 71),
    //   origin: new google.maps.Point(0, 0),
    //   anchor: new google.maps.Point(17, 34),
    //   scaledSize: new google.maps.Size(25, 25),
    // };
    let color = this.getColor()
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
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
    this.currentSelectedPlace = place;
    this.map.fitBounds(bounds);
    this.map.setZoom(8);
    if (!this.openedLocInfo) {
      this.ToggleLocInfo();

    }

  }

getColor(){ 
    return "hsl(" + 360 * Math.random() + ',' +
               100+ '%,' + 
               (85 + 10 * Math.random()) + '%)'
  }

  
  saveLocation() {
    console.log(this.currentSelectedPlace);
    console.log("Trip id: " + this.tripID);
    this.tripSvc.addSubTrip(this.currentSelectedPlace, this.tripID);
  }


  deleteTrip(){
    console.log("Trip id: " + this.tripID);
    this.tripSvc.deleteTrip(this.tripID, this.tripID);
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






/*
***************************
DEPRECATED STUFF DOWN HERE!
***************************
*/
setMapType(mapTypeId: string) {
  this.map.setMapTypeId(mapTypeId)
}

setCenter() {
  this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));

  let location = new google.maps.LatLng(this.latitude, this.longitude);

  let marker = new google.maps.Marker({
    position: location,
    map: this.map,
    title: 'Got you!'
  });

  marker.addListener('click', this.simpleMarkerHandler);

  marker.addListener('click', () => {
    this.markerHandler(marker);
  });
}

simpleMarkerHandler() {
  alert('Simple Component\'s function...');
}

markerHandler(marker: google.maps.Marker) {
  alert('Marker\'s Title: ' + marker.getTitle());
}

showCustomMarker() {
  this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));

  let location = new google.maps.LatLng(this.latitude, this.longitude);

  console.log(`selected marker: ${this.selectedMarkerType}`);

  let marker = new google.maps.Marker({
    position: location,
    map: this.map,
    icon: this.iconBase + this.selectedMarkerType,
    title: 'Got you!'
  });
}

toggleMap() {
  this.isHidden = !this.isHidden;

  this.gmapElement.nativeElement.hidden = this.isHidden;

}


}
