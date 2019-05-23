import { MongooseRunNode } from "src/app/core/models/mongoose-run-node.model";

export interface InactiveNodeAlert { 
    type: string;
    message: string;
    node: MongooseRunNode; 
}