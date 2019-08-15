import { MongooseRunNode } from "src/app/core/models/mongoose-run-node.model";
import { NodeSetUpAlert } from "./node-setup-alert.type";

export class InactiveNodeAlert { 
    alertType: string = "danger";
    message: string;
    mongooseNode: MongooseRunNode; 

    constructor(displayingMessage: string, mongooseNode: MongooseRunNode, type: NodeSetUpAlert) { 
        this.message = displayingMessage;
        this.mongooseNode = mongooseNode; 
    }
}