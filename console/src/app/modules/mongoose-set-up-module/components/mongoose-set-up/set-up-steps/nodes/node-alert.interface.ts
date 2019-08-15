import { MongooseRunNode } from "src/app/core/models/mongoose-run-node.model";
import { NodeSetUpAlertType } from "./node-setup-alert.type";

export class NodeAlert { 
    alertType: string = "danger";
    message: string;
    mongooseNode: MongooseRunNode; 

    constructor(displayingMessage: string, mongooseNode: MongooseRunNode, type: NodeSetUpAlertType) { 
        this.message = displayingMessage;
        this.mongooseNode = mongooseNode; 
    }
}