import { ResourceLocatorType } from "./address-type";

export class MongooseRunNode { 
   
    private readonly resourceLocation: string; 
    private readonly resourceType: ResourceLocatorType; 
    private readonly storageDriverType: string;
    private readonly imageVersion: string;

    constructor(resourceLocation: string, resourceType: ResourceLocatorType = ResourceLocatorType.IP, storageDriverType = "", imageVersion = "") { 
        this.resourceLocation = resourceLocation;
        this.resourceType = resourceType;
        this.storageDriverType = storageDriverType;
        this.imageVersion = imageVersion;
    }

    public getResourceLocation(): string { 
        return this.resourceLocation;
    }

    public getResourceType(): ResourceLocatorType { 
        return this.resourceType; 
    }

    public getDriverType(): string { 
        return this.storageDriverType;
    }

    public getImageVersion(): string { 
        return this.imageVersion;
    }

    public toString(): String { 
        return this.resourceLocation; 
    }
}
