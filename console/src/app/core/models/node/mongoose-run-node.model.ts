import { ResourceLocatorType } from "../address-type";

export class MongooseRunNode { 
   
    private readonly resourceLocation: string; 
    private readonly resourceType: ResourceLocatorType; 

    constructor(resourceLocation: string, resourceType: ResourceLocatorType = ResourceLocatorType.IP) { 
        this.resourceLocation = resourceLocation;
        this.resourceType = resourceType;
    }

    public getResourceLocation(): string { 
        return this.resourceLocation;
    }

    public getResourceType(): ResourceLocatorType { 
        return this.resourceType; 
    }

    public toString(): String { 
        return this.resourceLocation; 
    }
}