export class SubTripsModel {
    name = '';
    formattedAddr = '';
    gmapObject: any;
    activities: any[] = []; 


    static fromObject(object: any): SubTripsModel {
        const t: SubTripsModel = new SubTripsModel();
        //Need to clean this up, for now just store google maps location object and the name for easy access
        console.log(object);
        t.name = object.name;
        console.log("from object name: " + object.name);
        t.formattedAddr = object.formatted_address;
        t.gmapObject = object;
        t.activities = object.activities;
        return t;
    }
    toObject(): any {
        return { name: this.name, gmapObject:this.gmapObject, activities:this.activities };
    }
}