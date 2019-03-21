import { RunDuration } from '../run-duration';
import { MongooseRunStatus } from '../mongoose-run-status';

export class MongooseRunRecord { 

    private readonly loadStepId: String;
    public status: MongooseRunStatus;
    public startTime: String;
    public nodes: String[];
    public comment: String;
    private duration: string;


    constructor(loadStepId: String, status: MongooseRunStatus,  startTime: String, nodes: String[],  duration: string, comment: String) { 
        this.loadStepId = loadStepId;
        this.status = status;
        this.startTime = startTime;
        this.nodes = nodes;
        this.duration = duration;
        this.comment = comment;
    }

    // MARK: - Public
    getDuration(): string { 
        return this.duration;
    }

    getIdentifier(): String { 
        return this.loadStepId;
    }

    getNodesList(): String[] { 
        return this.nodes;
    }

    getComment(): String { 
        return this.comment;
    }

    // MARK: - Private 
}
