import { RunDuration } from '../run-duration';
import { MongooseRunStatus } from '../mongoose-run-status';
import { BehaviorSubject, Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

export class MongooseRunRecord implements OnDestroy {

    private readonly DEFAULT_VALUE = "-";

    public currentStatus: MongooseRunStatus = MongooseRunStatus.Undefined;
    public startTime: String;
    public nodes: String[];
    public comment: String;

    public hasConfig: boolean = undefined;
    public hasTotalFile: boolean = undefined;

    private readonly loadStepId: String;
    private duration: string;
    private status$: BehaviorSubject<MongooseRunStatus> = new BehaviorSubject<MongooseRunStatus>(MongooseRunStatus.Undefined); 
    private statusSubscription: Subscription; 

    constructor(loadStepId: String, status: MongooseRunStatus, startTime: String, nodes: String[], duration: string, comment: String) {
        this.loadStepId = loadStepId;
        this.startTime = startTime;
        this.nodes = nodes;
        this.duration = duration;
        this.comment = comment;

        this.status$.next(status);
        this.statusSubscription = this.status$.subscribe(
            newStatus => { 
                this.currentStatus = newStatus; 
            },
            error => { 
                console.log(`Unable to update status of record with load-step-id ${this.getIdentifier()}. Reason: ${error.message}`);
            }
        )
    }

    ngOnDestroy(): void { 
        this.statusSubscription.unsubscribe(); 
    }

    // MARK: - Public
    getDuration(): string {
        if (this.duration == "") {
            return this.DEFAULT_VALUE;
        }
        return this.duration;
    }

    getIdentifier(): String {
        return this.loadStepId;
    }

    getNodesList(): String[] {
        if (this.nodes.length == 0) {
            return [this.DEFAULT_VALUE];
        }
        return this.nodes;
    }

    getComment(): String {
        let isEmpty: boolean = (this.comment == "");
        return (isEmpty ? this.DEFAULT_VALUE : this.comment)
    }

    getStatus(): MongooseRunStatus {
        return this.currentStatus;
    }

    setStatus(status: MongooseRunStatus) {
        this.status$.next(status);
    }

    updateStatus() {
        this.currentStatus = this.getActualStatus();
    }

    getStartTime(): String {
        return this.startTime;
    }

    getDuraton(): string {
        return this.duration;
    }

    setDuration(updatedDuration: string) {
        this.duration = updatedDuration;
    }

    // MARK: - Private 

    private getActualStatus(): MongooseRunStatus {
        if ((this.hasConfig == undefined) || (this.hasTotalFile == undefined)) {
            return MongooseRunStatus.Undefined;
        }

        if (!this.hasConfig) {
            return MongooseRunStatus.Unavailable;
        }

        if (this.hasConfig && this.hasTotalFile) {
            return MongooseRunStatus.Finished;
        }

        if (this.hasConfig && !this.hasTotalFile) {
            return MongooseRunStatus.Running;
        }

        return MongooseRunStatus.Undefined;;
    }
}
