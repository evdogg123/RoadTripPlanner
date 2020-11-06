export class TripsModel {
    userId = '';
    id = '';
    name = '';
    description?= '';
    length = '';
    subTrips: any[] = [];


    static fromObject(object: any): TripsModel {
        const t: TripsModel = new TripsModel();
        t.userId = object.userId;
        t.name = object.name;
        t.description = object.description;
        t.length = object.length;
        t.subTrips = object.subTrips || [];
        return t;
    }
    toObject(): any {
        return { name: this.name, description: this.description, userId: this.userId, length: this.length, subTrips: this.subTrips };
    }
}