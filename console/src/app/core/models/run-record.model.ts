import { RunDuration } from '../run-duration';
import { MongooseRunStatus } from '../mongoose-run-status';

export class MongooseRunRecord {

    readonly DEFAULT_VALUE = "-";

    public status: MongooseRunStatus;
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

        if (targetStatus != this.status) {
            let misleadingMsg = "Collision in Mongoose Run status and availability of its files.";
            let currentRunStatusMsg = "Recorded run status is: " + this.status;
            let determinedRunStatusMsg = "Determined run status is: " + targetStatus;
            console.error(misleadingMsg + currentRunStatusMsg + determinedRunStatusMsg);

            let statusChangeNotification = "Changing load-step " + this.getIdentifier() + " status to " + targetStatus;
            console.error(statusChangeNotification);
            this.status = targetStatus;
        }

        return targetStatus;
    }

    setStatus(status: MongooseRunStatus) {
        this.status = status;
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
