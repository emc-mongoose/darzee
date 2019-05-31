import { MongooseRunStatus } from './mongoose-run-status';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { MongooseRunEntryNode } from '../services/local-storage-service/MongooseRunEntryNode';

export class MongooseRunRecord implements OnDestroy {

    private readonly DEFAULT_VALUE = "-";

    public startTime: String;
    public nodes: String[];
    public comment: String;

    private readonly entryNode: MongooseRunEntryNode;
    private loadStepId: String = "";

    private currentDuration: string = "";
    private duration$: Observable<string>;

    private statusSubscription: Subscription = new Subscription();
    private currentStatus: MongooseRunStatus = MongooseRunStatus.Unavailable;
    private status$: Observable<MongooseRunStatus>;

    // MARK: - Lifecycle 

    constructor(loadStepId: String, mongooseRunStatus$: Observable<MongooseRunStatus>, startTime: String, nodes: String[], duration$: Observable<string>, comment: String, entryNode: MongooseRunEntryNode) {
        this.loadStepId = loadStepId;
        this.startTime = startTime;
        this.nodes = nodes;
        this.comment = comment;

        this.status$ = mongooseRunStatus$;
        this.entryNode = entryNode;
        this.statusSubscription.add(this.status$.subscribe(
            fetchedStatus => {
                this.currentStatus = fetchedStatus;
            },
            error => {
                // NOTE: Handle situation of Mongoose entry node unavailability
                this.currentStatus = MongooseRunStatus.Finished;
            }
        ));

        this.duration$ = duration$;
        this.statusSubscription.add(this.duration$.subscribe(
            (fetchedDuration: string) => { 
                this.currentDuration = fetchedDuration;
            }
        ))
    }

    ngOnDestroy(): void {
        this.statusSubscription.unsubscribe();
    }

    // MARK: - Public

    public getStatusObs(): Observable<MongooseRunStatus> {
        return this.status$;
    }


    public getLoadStepId(): String {
        return this.loadStepId;
    }

    public getDuration(): string {
        if (this.currentDuration == "") {
            return this.DEFAULT_VALUE;
        }
        return this.currentDuration;
    }

    public getRunId(): String {
        return this.entryNode.getRunId();
    }

    public getNodesList(): String[] {
        if (this.nodes.length == 0) {
            return [this.DEFAULT_VALUE];
        }
        return this.nodes;
    }

    public getComment(): String {
        let isEmpty: boolean = (this.comment == "");
        return (isEmpty ? this.DEFAULT_VALUE : this.comment)
    }

    public getStatus(): MongooseRunStatus {
        return this.currentStatus;
    }

    public getStartTime(): String {
        return this.startTime;
    }

    public getDuraton(): string {
        return this.currentDuration;
    }

    public setDuration(updatedDuration: string) {
        this.currentDuration = updatedDuration;
    }

    public getEntryNodeAddress(): string {
        return this.entryNode.getEntryNodeAddress();
    }

    public setEntryNodeAddress(entryNodeAddress: string) {
        this.entryNode.setEntryNodeAddress(entryNodeAddress);
    }
    // MARK: - Private 

}
