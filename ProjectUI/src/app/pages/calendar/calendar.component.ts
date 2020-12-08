import {
  Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, Input, ChangeDetectorRef
} from '@angular/core';
import {
  startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView, } from 'angular-calendar';
import { ViewEncapsulation } from '@angular/core';
import { AlertService } from 'src/app/elements/_alert';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#33cc33',
    secondary: '#33cc33',
  },
};
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  @Input() savedPlaces;
  oldSavedPlaces: any = [];
  paintBrushColor = "white"
  selectedDayViewDate: Date;
  selectedDays: any = [];
  selectedMonthViewDay: CalendarMonthViewDay;
  selectedPlace: any;
  dateToPlaceBindings: any = {};

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log(this.startDate);
      this.initializeDateToPlaceBindings();
      this.setView(CalendarView.Month);
      this.ref.detectChanges();
    }, 6000);

  }


  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;

  viewDate: Date = new Date();
  startDate: Date;
  endDate: Date;


  modalData: {
    action: string;
    event: CalendarEvent;
  };




  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];


  refresh: Subject<any> = new Subject();


  events: CalendarEvent[] = [
  ];



  activeDayIsOpen: boolean = false;

  constructor(private modal: NgbModal, private ref: ChangeDetectorRef, protected alertService: AlertService) { }


  // dayClicked(event): void {
  //   console.log(event);
  //   let day: any= event["day"];
  //   let date:Date = day["date"];
  //   let events : CalendarEvent[] = day["events"];
  //   console.log(date);
  //   console.log(events);
  //   if (isSameMonth(date, this.viewDate)) {
  //     if (
  //       (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
  //       events.length === 0
  //     ) {
  //       this.activeDayIsOpen = false;
  //     } else {
  //       this.activeDayIsOpen = true;
  //     }
  //     this.viewDate = date;
  //   }
  //   event["sourceEvent"]["toElement"].setAttribute("style", "background-color:red;");
  //   console.log(event["sourceEvent"]["toElement"]);
  // }


  dayClicked(day: CalendarMonthViewDay): void {
    console.log(day);
    if (this.dateIsValid(day.date)) {
      this.selectedMonthViewDay = day;

      const selectedDateTime = this.selectedMonthViewDay.date.getTime();
      const dateIndex = this.selectedDays.findIndex(
        (selectedDay) => selectedDay.date.getTime() === selectedDateTime
      );
      if (dateIndex > -1) {
        delete this.selectedMonthViewDay.cssClass;
        this.selectedDays.splice(dateIndex, 1);
      } else {
        this.selectedDays.push(this.selectedMonthViewDay);
        this.selectedMonthViewDay = day;
        // day.cssClass = 'cal-day-selected1';
        if (this.dateToPlaceBindings[addDays(day.date, 1).toString()] == this.selectedPlace ||
          this.dateToPlaceBindings[subDays(day.date, 1).toString()] == this.selectedPlace) {
          //Doesnt quite work should fix it if I have time
          if (!this.isOnlyDay(this.dateToPlaceBindings[day.date.toString()])) {
            day.backgroundColor = this.selectedPlace.color;
            day["location"] = this.selectedPlace.name;
            this.dateToPlaceBindings[day.date.toString()] = this.selectedPlace;
          }
          else {
            this.alertService.error("Invalid Operation", { autoClose: true });
          }


        }
        else {
          this.alertService.error("Invalid Operation", { autoClose: true });
        }



      }

      this.viewDate = day.date;

    }

  }

  isOnlyDay(place: any) {
    let count = 0;
    console.log(place);
    for (let [key, value] of Object.entries(this.dateToPlaceBindings)) {
      if (this.dateToPlaceBindings[key]["formatted_address"] == place["formatted_address"]) {
        count += 1;
        if (count > 1) {
          return false;
        }
      }
    }
    return true;

  }
  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    console.log("IN beforeMonthViewRender");
    body.forEach((day) => {
      if (!this.dateIsValid(day.date)) {
        day.cssClass = 'cal-disabled';
      }

      else if (
        this.selectedDays.some(
          (selectedDay) => selectedDay.date.getTime() === day.date.getTime()
        )
      ) {

        if (this.dateToPlaceBindings[day.date.toString()]) {
          day.backgroundColor = this.dateToPlaceBindings[day.date.toString()].color;
          day["location"] = this.dateToPlaceBindings[day.date.toString()].name;
        }
      }

      else {
        if (this.dateToPlaceBindings[day.date.toString()]) {
          day.backgroundColor = this.dateToPlaceBindings[day.date.toString()].color;
          day["location"] = this.dateToPlaceBindings[day.date.toString()].name;
        }
      }

    });
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  dateIsValid(date: Date): boolean {
    return date >= startOfDay(this.startDate) && date <= this.endDate;
  }

  setSelectedLocation(place: any) {
    console.log(place);
    this.selectedPlace = place;
    this.paintBrushColor = this.selectedPlace.color;
  }
  initializeDateToPlaceBindings() {
    if (this.savedPlaces.dateToPlaceBindings) {
      //To do, send stuff to backend save these bindings
    }
    else if (!this.isSameSavedPlaces(this.oldSavedPlaces, this.savedPlaces)) {
      let current = this.startDate;
      let end = this.endDate;
      let diffTime = end.getTime() - current.getTime();
      let numDays = (diffTime / (1000 * 3600 * 24)) + 1;
      console.log(numDays);
      let numLocations = this.savedPlaces.length;
      console.log("NUMBER OR LOCATIONS: " + numLocations);
      let daysPerLocation = Math.floor(numDays / numLocations);
      let extraDays = numDays % numLocations;
      console.log(extraDays);
      console.log(daysPerLocation);

      for (let i = 0; i < numLocations; i++) {
        for (let j = 0; j < daysPerLocation; j++) {
          this.dateToPlaceBindings[current.toString()] = this.savedPlaces[i]
          current = addDays(current, 1);
        }
        if (extraDays > 0) {
          this.dateToPlaceBindings[current.toString()] = this.savedPlaces[i];
          current = addDays(current, 1);
          extraDays -= 1;
        }

      }
      console.log(this.dateToPlaceBindings);
      this.setView(CalendarView.Week);
      this.ref.detectChanges();
      this.setView(CalendarView.Month);
      this.ref.detectChanges();
      this.oldSavedPlaces = JSON.parse(JSON.stringify(this.savedPlaces));

    }

  }

  isSameSavedPlaces(oldSaved: any, newSaved: any) {
    console.log(oldSaved);
    console.log(newSaved);
    if (oldSaved.length != newSaved.length) {
      return false;
    }
    else {
      for (let i = 0; i < oldSaved.length; i++) {
        if (oldSaved[i]["formatted_address"] != newSaved[i]["formatted_address"]) {
          return false;
        }
      }
      return true;
    }


  }

}