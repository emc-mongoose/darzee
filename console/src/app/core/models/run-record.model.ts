import { RunDuration } from '../run-duration';
import { MongooseRunStatus } from '../mongoose-run-status';

export class MongooseRunRecord {

    private readonly DEFAULT_VALUE = "-";
    private readonly DEFAULT_STATUS = MongooseRunStatus.All;

    public status: MongooseRunStatus = this.DEFAULT_STATUS;
    public startTime: String;
    public nodes: String[];
    public comment: String;

    public hasConfig: boolean = undefined;
    public hasTotalFile: boolean = undefined;

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
        this.status = this.getActualStatus();
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
            return this.DEFAULT_STATUS;
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

        return this.DEFAULT_STATUS;
    }
}
