import { AppRouter } from "../common/AppRouter";
import { SecurityMiddleware } from "../security/securityMiddleware";
import { TripsController } from "./tripsController";


export class TripsRouter extends AppRouter{
    static tripsController: TripsController=new TripsController();
    constructor(){super();}

    //sets up the routes within this module shows an example of a route that requires authorization, and one that does not
    setupRoutes(): void {      
        this.expressRouter.get('/',[SecurityMiddleware.RequireAuth],TripsRouter.tripsController.getTrips);
        this.expressRouter.get('/trip/:tripId',[SecurityMiddleware.RequireAuth],TripsRouter.tripsController.getTrip);
        this.expressRouter.post('/trip/:tripId',[SecurityMiddleware.RequireAuth],TripsRouter.tripsController.addSubTrip);
        //this.expressRouter.get('/trips/:trip-id/subtrips',TripsRouter.tripsController.getSubTrips);
       // this.expressRouter.get('/trips/:trip-id/sub-trips/:subtrip-id',TripsRouter.tripsController.getSubTrip);
        
        this.expressRouter.post('/',[SecurityMiddleware.RequireAuth],TripsRouter.tripsController.addTrip);
       // this.expressRouter.post('/trips/:trip-id',[SecurityMiddleware.RequireAuth],TripsRouter.tripsController.addSubTrip);

        this.expressRouter.put('/:trip-id',[SecurityMiddleware.RequireAuth],TripsRouter.tripsController.updateTrip);
       // this.expressRouter.put('/trips/:trip-id/subtrips/:subtrip-id',[SecurityMiddleware.RequireAuth],TripsRouter.tripsController.updateSubTrip);
        
        this.expressRouter.delete('/:trip-id',[SecurityMiddleware.RequireAuth],TripsRouter.tripsController.deleteTrip);

    }    
}