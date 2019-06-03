import { BehaviorSubject, Observable } from "rxjs";
import { MongooseRunNode } from "./mongoose-run-node.model";

export class MongooseRunNodesRepository {

    private availableMongooseNodes$: BehaviorSubject<MongooseRunNode[]> = new BehaviorSubject<MongooseRunNode[]>([])
    private mongooseRunNodes: MongooseRunNode[] = [];

    constructor(initialNodes: MongooseRunNode[] = []) {
        this.addMultipleNodes(initialNodes);
    }

    // MARK: - Public 

    public getAvailableRunNodes(): Observable<MongooseRunNode[]> {
        return this.availableMongooseNodes$.asObservable();
    }

    public addMongooseRunNode(mongooseRunNode: MongooseRunNode) {
        if (this.hasMongooseRunNodeBeenSaved(mongooseRunNode)) {
            // console.error(`Node with address "${mongooseRunNode.getResourceLocation()}" is already exist.`);
            return;
        }

        this.mongooseRunNodes.push(mongooseRunNode);
        this.availableMongooseNodes$.next(this.mongooseRunNodes);
    }


    public deleteMongooseRunNode(mongooseRunNode: MongooseRunNode) {
        let filredNodesList = this.availableMongooseNodes$.getValue().filter(node => {
            if (node.getResourceType() != mongooseRunNode.getResourceType()) {
                // NOTE: No noeed to compare nodes if their resources have different types. 
                return true;
            }
            return (node.getResourceLocation() != mongooseRunNode.getResourceLocation());
        });
        this.availableMongooseNodes$.next(filredNodesList);
    }

    // MARK: - Private 

    private addMultipleNodes(mongooseNodes: MongooseRunNode[]) {
        mongooseNodes.forEach(mongooseNode => {
            this.mongooseRunNodes.push(mongooseNode);
            this.availableMongooseNodes$.next(this.mongooseRunNodes);
        })
    }

    private hasMongooseRunNodeBeenSaved(mongooseRunNode: MongooseRunNode): boolean {
        var isNodeSaved = false;
        this.mongooseRunNodes.forEach(node => {
            let isLocationSame = (node.getResourceLocation() == mongooseRunNode.getResourceLocation());
            let isResourceTypeSame = (node.getResourceType() == mongooseRunNode.getResourceType());
            let isNodeSame = (isLocationSame && isResourceTypeSame);
            if (isNodeSame) {
                isNodeSaved = true;
                return;
            }
        });
        return isNodeSaved;
    }
}
