export class TripsModel {
    userId = '';
    id = '';
    name = '';
    description?= '';
    startDate = '';
    endDate = '';
    subTrips: any[] = [];


    static fromObject(object: any): TripsModel {
        const t: TripsModel = new TripsModel();
        t.userId = object.authUser.email;
        t.name = object.name;
        t.description = object.description;
        t.startDate = object.startDate;
        t.endDate = object.endDate;
        t.subTrips = object.subTrips || [];
        return t;
    }
    toObject(): any {
        return { name: this.name, description: this.description, userId: this.userId, startDate: this.startDate, endDate: this.endDate, subTrips: this.subTrips };
    }
}