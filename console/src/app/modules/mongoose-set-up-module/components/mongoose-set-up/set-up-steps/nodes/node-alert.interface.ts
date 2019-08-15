import { MongooseRunNode } from "src/app/core/models/mongoose-run-node.model";
import { NodeSetUpAlertType } from "./node-setup-alert.type";

export class NodeAlert {

    /**
     * @param mongooseNode node that caused an alert to appear.
     * @param message displays basic alert message.
     */

    public message: string;
    public mongooseNode: MongooseRunNode;

    /**
     * @param alertType determines type (appearence) of alert.
     */
    private alertType: string = "danger";


    constructor(displayingMessage: string, mongooseNode: MongooseRunNode, type: NodeSetUpAlertType) {
        this.message = displayingMessage;
        this.mongooseNode = mongooseNode;
    }
}