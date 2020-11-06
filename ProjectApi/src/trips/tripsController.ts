import express, { RequestHandler } from 'express';
import { TripsModel } from './tripsModel';
import { SubTripsModel } from './subTripsModel';
import { Database } from '../common/MongoDB';
import { Config } from '../config';
import { Client, defaultAxiosInstance } from "@googlemaps/google-maps-services-js";
import { } from 'googlemaps';
import  { AxiosInstance } from "axios";

export class TripsController {


    static db: Database = new Database(Config.url, "users");
    static tripsTable = 'users';

    //TODO!
    /*
    getSubTrips
    getSubTrip
    addSubTrip
    updateTrip
    updateSubTrip
    */

    getTrips(req: express.Request, res: express.Response) {
      
        const user_id = req.params.user_id; //Don't think I need this?
        console.log(req);
        TripsController.db.getRecords(TripsController.tripsTable, { user_id: user_id })
            .then((results) => res.send({ fn: 'getTrips', status: 'success', data: results }).end())
            .catch((reason) => res.status(500).send(reason).end());
    }

    //getTrip
    //sends the specific Trip as JSON with id=:id
    getTrip(req: express.Request, res: express.Response) {
        const tripId = Database.stringToId(req.params.tripId);
        console.log(tripId);
        TripsController.db.getOneRecord(TripsController.tripsTable, { _id: tripId })
            .then((results) => res.send({ fn: 'getTrip', status: 'success', data: results }).end())
            .catch((reason) => res.status(500).send(reason).end());
    }
    //addTrip
    //adds the Trip to the database
    addTrip(req: express.Request, res: express.Response) {
        console.log("Trying to add trip...");

        const trip: TripsModel = TripsModel.fromObject(req.body);

        TripsController.db.addRecord(TripsController.tripsTable, trip.toObject())
            .then((result: boolean) => res.send({ fn: 'addTrip', status: 'success' }).end())
            .catch((reason) => res.status(500).send(reason).end());

    }
    addSubTrip(req: express.Request, res: express.Response) {
        console.log("Trying to add subTrip...");
        console.log(req.params.tripId);
        const tripId = Database.stringToId(req.params.tripId);
        console.log(tripId);

        const subTrip: SubTripsModel = SubTripsModel.fromObject(req.body);
     
        //{ $push: {subTrips:req.body}}
        TripsController.db.updateRecord(TripsController.tripsTable, { _id: tripId  },  {$addToSet: { 'subTrips': req.body }} )
            .then((results) => results ? (res.send({ fn: 'updateTrip', status: 'success' })) : (res.send({ fn: 'addSubTrip', status: 'failure', data: 'Not found' })).end())
            .catch(err => res.send({ fn: 'addSubTrip', status: 'failure', data: err }).end());


        
    }






    //updateTrip
    //updates the trip in the database with id :id
    updateTrip(req: express.Request, res: express.Response) {
        const id = Database.stringToId(req.params.id);
        const data = req.body;
        delete data.authUser;
        TripsController.db.updateRecord(TripsController.tripsTable, { _id: id }, { $set: req.body })
            .then((results) => results ? (res.send({ fn: 'updateTrip', status: 'success' })) : (res.send({ fn: 'updateTrip', status: 'failure', data: 'Not found' })).end())
            .catch(err => res.send({ fn: 'updateTrip', status: 'failure', data: err }).end());

    }
    //deleteTrip
    //deletes the Trip int he database with id :id
    deleteTrip(req: express.Request, res: express.Response) {
        const id = Database.stringToId(req.params.id);
        TripsController.db.deleteRecord(TripsController.tripsTable, { _id: id })
            .then((results) => results ? (res.send({ fn: 'deleteTrip', status: 'success' })) : (res.send({ fn: 'deleteTrip', status: 'failure', data: 'Not found' })).end())
            .catch((reason) => res.status(500).send(reason).end());
    }

    /*

    
    //getSemesters
    //returns all valid unique semesters in the database
    getSemesters(req: express.Request, res: express.Response) {
        TripsController.db.getRecords(TripsController.tripsTable)
            .then(results => {
                //extracts just the semester
                let semesters = results.map((x: any) => x.semester);
                //removes duplciates
                semesters = semesters.filter((value: string, index: number, array: any[]) =>
                    !array.filter((v, i) => value === v && i < index).length);
                res.send({ fn: 'deleteTrip', status: 'success', data: { semesters: semesters } })
            })
            .catch((reason) => res.status(500).send(reason).end());
    }
    //getTripNumbers
    //returns all valid unique TripNumbers for a given semesters in the database
    getTripNumbers(req: express.Request, res: express.Response) {
        const semester = req.params.semester;
        TripsController.db.getRecords(TripsController.tripsTable,{semester:semester})
            .then(results => {
                //extracts just the TripNumber
                let Trips = results.map((x: any) => x.TripNumber);
                //removes duplciates
                Trips = Trips.filter((value: number, index: number, array: any[]) =>
                    !array.filter((v, i) => value === v && i < index).length);
                res.send({ fn: 'deleteTrip', status: 'success', data: { TripNumbers:Trips.sort()} });
            })
            .catch((reason) => res.status(500).send(reason).end());
    }
    */

}
