export class SubTripsModel {
    name = '';
    gmapObject: any;
    activities: any[] = []; 


    static fromObject(object: any): SubTripsModel {
        const t: SubTripsModel = new SubTripsModel();
        //Need to clean this up, for now just store google maps location object and the name for easy access
        t.name = object.name;
        t.gmapObject = object;
        t.activities = object.activities;
        return t;
    }
    toObject(): any {
        return { name: this.name, gmapObject:this.gmapObject, activities:this.activities };
    }
}