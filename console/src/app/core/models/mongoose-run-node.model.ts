import { ResourceLocatorType } from "./address-type";

export class MongooseRunNode { 
    resourceLocation: string; 
    resourceType: ResourceLocatorType; 

    constructor(resourceLocation: string, resourceType: ResourceLocatorType = ResourceLocatorType.IP) { 
        this.resourceLocation = resourceLocation;
        this.resourceType = resourceType;
    }
}