import { RunDuration } from '../run-duration';
import { MongooseRunStatus } from '../mongoose-run-status';

export class MongooseRunRecord { 

    public status: MongooseRunStatus;
    public startTime: String;
    public nodes: String[];
    public duration: RunDuration;
    public comment: String;

    constructor(status: MongooseRunStatus,  startTime: String, nodes: String[],  duration: RunDuration, comment: String) { 
        this.status = status;
        this.startTime = startTime;
        this.nodes = nodes;
        this.duration = duration;
        this.comment = comment;
    }

}