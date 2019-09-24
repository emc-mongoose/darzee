import { MongooseRunNode } from "src/app/core/models/mongoose-run-node.model";
import { NodeSetUpAlertType } from "./node-setup-alert.type";

export class NodeAlert {

    /**
     * @param mongooseNode node that caused an alert to appear.
     * @param message displays basic alert message.
     * @param cssType CSS custom type of the alert.
     */

    public message: string;
    public mongooseNode: MongooseRunNode;
    public cssType: string = "danger";

    // MARK: - Lifecycle 

    constructor(displayingMessage: string, mongooseNode: MongooseRunNode, type: NodeSetUpAlertType) {
        this.message = displayingMessage;
        this.mongooseNode = mongooseNode;
        this.cssType = this.getAlertCssType(type);
    }

    // MARK: - Public 

    // MARK: - Private

    private getAlertCssType(type: NodeSetUpAlertType): string {
        switch (type) {
            case NodeSetUpAlertType.ERROR: {
                return "danger";
            }
            case NodeSetUpAlertType.WARNING: {
                return "warning";
            }
            default: {
                return "info";
            }
        }
    }
}
