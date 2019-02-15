import { RunDuration } from '../run-duration';
import { MongooseRunStatus } from '../mongoose-run-status';

export class MongooseRunRecord { 

    public startTime: String;
    public nodes: String[];
    public comment: String;

    private status: MongooseRunStatus;
    private duration: RunDuration;


    constructor(status: MongooseRunStatus,  startTime: String, nodes: String[],  duration: RunDuration, comment: String) { 
        this.status = status;
        this.startTime = startTime;
        this.nodes = nodes;
        this.duration = duration;
        this.comment = comment;
    }

    // MARK: - Public
    getDuration(): string { 
        return this.duration.getDuration();
    }

    getStatus(): string { 
        switch (this.status) { 
            case MongooseRunStatus.Finished: { 
                return "Finished";
            }
            case MongooseRunStatus.Running: { 
                return "Running";
            }
        }
    }

}