import { RunDuration } from '../run-duration';
import { MongooseRunStatus } from '../mongoose-run-status';

export class MongooseRunRecord { 

    private readonly id: number;
    public status: MongooseRunStatus;
    public startTime: String;
    public nodes: String[];
    public comment: String;
    private duration: RunDuration;


    constructor(status: MongooseRunStatus,  startTime: String, nodes: String[],  duration: RunDuration, comment: String) { 
        this.id = MongooseRecordIdFabric.generateIdentifier();
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

    getIdentifier(): number { 
        return this.id;
    }
}

class MongooseRecordIdFabric { 
    static id: number = 0; 

    static generateIdentifier(): number { 
        return ++MongooseRecordIdFabric.id; 
    }
}