import { MongooseRunNode } from "src/app/core/models/mongoose-run-node.model";

export class InactiveNodeAlert { 
    alertType: string = "danger";
    message: string;
    mongooseNode: MongooseRunNode; 

    constructor( displayingMessage: string, mongooseNode: MongooseRunNode) { 
        this.message = displayingMessage;
        this.mongooseNode = mongooseNode; 
    }
}