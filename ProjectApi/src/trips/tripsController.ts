import express, { RequestHandler } from 'express';
import { TripsModel } from './tripsModel';
import { SubTripsModel } from './subTripsModel';
import { Database } from '../common/MongoDB';
import { Config } from '../config';
import { Client, defaultAxiosInstance } from "@googlemaps/google-maps-services-js";
import { } from 'googlemaps';
import { AxiosInstance } from "axios";
import wiki from 'wikijs';

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

    updateCenter(req: express.Request, res: express.Response) {
        const tripId = Database.stringToId(req.params.tripId);
        console.log(req.body);
        console.log(tripId);
        TripsController.db.updateRecord(TripsController.tripsTable, { _id: tripId }, { $set: req.body })
            .then((results) => results ? (res.send({ fn: 'updateTrip', status: 'success' })) : (res.send({ fn: 'updateTrip', status: 'failure', data: 'Not found' })).end())
            .catch(err => res.send({ fn: 'updateTrip', status: 'failure', data: err }).end());
    }


    getTrips(req: express.Request, res: express.Response) {
        console.log(req);

        const user_id = req.body.authUser.email; //Don't think I need this?
        TripsController.db.getRecords(TripsController.tripsTable, { userId: user_id })
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
        const id = Database.stringToId(req.params.id);

        console.log(req);

        const trip: TripsModel = TripsModel.fromObject(req.body);

        TripsController.db.addRecord(TripsController.tripsTable, trip.toObject())
            .then((result: boolean) => res.send({ fn: 'addTrip', status: 'success', id: id }).end())
            .catch((reason) => res.status(500).send(reason).end());

    }

    addSubTrip(req: express.Request, res: express.Response) {
        console.log("Trying to add subTrip...");
        console.log(req.params.tripId);
        const tripId = Database.stringToId(req.params.tripId);
        console.log(tripId);

        const subTrip: SubTripsModel = SubTripsModel.fromObject(req.body);

        //{ $push: {subTrips:req.body}}
        TripsController.db.updateRecord(TripsController.tripsTable, { _id: tripId }, { $addToSet: { 'subTrips': req.body } })
            .then((results) => results ? (res.send({ fn: 'updateTrip', status: 'success' })) : (res.send({ fn: 'addSubTrip', status: 'failure', data: 'Not found' })).end())
            .catch(err => res.send({ fn: 'addSubTrip', status: 'failure', data: err }).end());


    }

    /* deleteSubTrip(req: express.Request, res: express.Response){
        console.log("Trying to delete subTrip...");
        const id = Database.stringToId(req.params.id);
        const subTrip = SubTripsModel.fromObject(req.body);
        const formAddr = subTrip.formattedAddr;
        const subName = subTrip.formattedAddr;
        TripsController.db.deleteSubRecord(TripsController.tripsTable, {_id: id}, {$pull: {'subTrips': name, subName}})
            .then((results) => results ? (res.send({ fn: 'deleteSubTrip', status: 'success' })) : (res.send({ fn: 'deleteSubTrip', status: 'failure', data: 'Not found' })).end())
            .catch(err => res.send({ fn: 'deleteSubTrip', status: 'failure', data: err }).end());
    } */

    deleteSubTrip(req: express.Request, res: express.Response) {
        console.log("Trying to delete subTrip...");
        const id = Database.stringToId(req.params.id);
        //const subTrip = SubTripsModel.fromObject(req.body);
        //const formAddr = subTrip.formattedAddr;
        const placeid = req.body.Name;
        console.log(placeid);
        TripsController.db.updateRecord(TripsController.tripsTable, { _id: id }, { $pull: { 'subTrips': { place_id: placeid } } })
            .then((results) => results ? (res.send({ fn: 'deleteSubTrip', status: 'success' })) : (res.send({ fn: 'deleteSubTrip', status: 'failure', data: 'Not found' })).end())
            .catch(err => res.send({ fn: 'deleteSubTrip', status: 'failure', data: err }).end());
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
        console.log("Trying to delete trip...");
        const id = Database.stringToId(req.params.id);
        TripsController.db.deleteRecord(TripsController.tripsTable, { _id: id })
            .then((results) => results ? (res.send({ fn: 'deleteTrip', status: 'success' })) : (res.send({ fn: 'deleteTrip', status: 'failure', data: 'Not found' })).end())
            .catch((reason) => res.status(500).send(reason).end());
    }

    editTrip(req: express.Request, res: express.Response) {
        console.log("Trying to edit trip...");
        const id = Database.stringToId(req.params.id);
        delete req.body.authUser;
        console.log(req.body);
        TripsController.db.updateRecord(TripsController.tripsTable, { _id: id }, { $set: req.body })
            .then((results) => results ? (res.send({ fn: 'editTrip', status: 'success' })) : (res.send({ fn: 'editTrip', status: 'failure', data: 'Not found' })).end())
            .catch((reason) => res.status(500).send(reason).end());
    }

    editSubStrip(req: express.Request, res: express.Response) {
        console.log("Tring to edit subtrip...");

    }

    getWikiSearch(req: express.Request, res: express.Response) {
        console.log(req.params);
        console.log(req.body);
        let response: any = {};
        wiki().page(req.params.data).then(page =>
            Promise.all([page.images(), page.summary(), page.mainImage()])
        ).then(
            data => res.send({ "data": data }));


    }

    addActivity(req: express.Request, res: express.Response) {
        const tripId = Database.stringToId(req.params.tripId);
        const subTripId = req.params.subTripId;
        TripsController.db.updateRecord(TripsController.tripsTable, { _id: tripId, "subTrips.place_id": subTripId }, { $addToSet: { 'subTrips.$.activities': req.body } })
            .then((results) => results ? (res.send({ fn: 'updateTrip', status: 'success' })) : (res.send({ fn: 'addSubTrip', status: 'failure', data: 'Not found' })).end())
            .catch(err => res.send({ fn: 'addSubTrip', status: 'failure', data: err }).end());

    }
    getSubTrip(req: express.Request, res: express.Response) {

        const tripId = Database.stringToId(req.params.tripId);
        const subTripId = req.params.subTripId;
        console.log(tripId);
        TripsController.db.getOneRecord(TripsController.tripsTable, { _id: tripId, "subTrips.place_id": subTripId })
            .then((results) => res.send({ fn: 'getTrip', status: 'success', data: results }).end())
            .catch((reason) => res.status(500).send(reason).end());

    }

}
