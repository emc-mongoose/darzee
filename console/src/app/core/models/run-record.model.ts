import { RunDuration } from '../run-duration';
import { MongooseRunStatus } from '../mongoose-run-status';
import { BehaviorSubject, Subscription, MonoTypeOperatorFunction, interval, Observable } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { tap, merge, mapTo, map } from 'rxjs/operators';
import { MergeMapOperator } from 'rxjs/internal/operators/mergeMap';

export class MongooseRunRecord implements OnDestroy {

    private readonly DEFAULT_VALUE = "-";

    public startTime: String;
    public nodes: String[];
    public comment: String;

    public hasConfig: Boolean = undefined;
    public hasTotalFile: Boolean = undefined;

    private readonly loadStepId: String;
    private duration: string;
    private status$: BehaviorSubject<MongooseRunStatus> = new BehaviorSubject<MongooseRunStatus>(MongooseRunStatus.Undefined);
    private statusSubscription: Subscription = new Subscription();
    private currentStatus: MongooseRunStatus = MongooseRunStatus.Undefined;

    private hasConfig$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
    private hasResultsFile$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

    constructor(loadStepId: String, mongooseRunStatus$: Observable<MongooseRunStatus>, startTime: String, nodes: String[], duration: string, comment: String) {
        this.loadStepId = loadStepId;
        this.startTime = startTime;
        this.nodes = nodes;
        this.duration = duration;
        this.comment = comment;

        this.statusSubscription.add(mongooseRunStatus$.subscribe(
            fetchedStatus => {
                this.status$.next(fetchedStatus);
            }
        ))
        this.configureSubscriptions();
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

    setConfigAvailabilityStatus(isConfigAvailable: Boolean) {
        this.hasConfig$.next(isConfigAvailable);
    }

    setResultsAvailabilityStatus(isResultAvailable: Boolean) {
        this.hasResultsFile$.next(isResultAvailable);
    }

    getStatus(): MongooseRunStatus {
        return this.currentStatus;
    }

    setStatus(status: MongooseRunStatus) {
        this.status$.next(status);
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

    private configureSubscriptions() {

        this.statusSubscription.add(this.status$.subscribe(
            newStatus => {
                this.currentStatus = newStatus;
            },
            error => {
                console.log(`Unable to update status of record with load-step-id ${this.getIdentifier()}. Reason: ${error.message}`);
            }
        ));

        this.statusSubscription.add(this.hasConfig$.subscribe(
            hasConfigUpdatedValue => {
                this.hasConfig = hasConfigUpdatedValue;
            },
            error => {
                console.log(`Couldn't check status of config file: ${error.message}`)
            }
        ));

        this.statusSubscription.add(this.hasResultsFile$.subscribe(
            hasResultsFileUpdatedValue => {
                this.hasTotalFile = hasResultsFileUpdatedValue;
            },
            error => {
                console.log(`Couldn't check status of results file: ${error.message}`)
            }
        ));
    }

}
