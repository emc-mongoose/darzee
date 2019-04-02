import { RunDuration } from '../run-duration';
import { MongooseRunStatus } from '../mongoose-run-status';

export class MongooseRunRecord {

    readonly DEFAULT_VALUE = "-";

    public status: MongooseRunStatus = MongooseRunStatus.All;
    public startTime: String;
    public nodes: String[];
    public comment: String;

    public hasConfig: boolean = false;
    public hasTotalFile: boolean = false;

    private readonly loadStepId: String;
    private duration: string;

    constructor(loadStepId: String, status: MongooseRunStatus, startTime: String, nodes: String[], duration: string, comment: String) {
        this.loadStepId = loadStepId;
        this.status = status;
        this.startTime = startTime;
        this.nodes = nodes;
        this.duration = duration;
        this.comment = comment;
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
        return this.status; 
    }

    setStatus(status: MongooseRunStatus) {
        this.status = status;
    }

    updateStatus() { 
        let targetStatus = MongooseRunStatus.All; 
    
        if (this.hasConfig && this.hasTotalFile) {
            targetStatus = MongooseRunStatus.Finished;
        }

        if (this.hasConfig && !this.hasTotalFile) {
            targetStatus = MongooseRunStatus.Running;
        }

        if (!this.hasConfig) {
            targetStatus = MongooseRunStatus.Unavailable;
        }
        this.status = targetStatus; 
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
}
