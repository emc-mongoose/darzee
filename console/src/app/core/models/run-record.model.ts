import { RunDuration } from '../run-duration';
import { MongooseRunStatus } from '../mongoose-run-status';

export class MongooseRunRecord {

    readonly DEFAULT_VALUE = "-";

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
        return (isEmpty ? this. DEFAULT_VALUE : this.comment)
    }

    getStatus(): MongooseRunStatus { 
        return this.status;
    }

    getStartTime(): String { 
        return this.startTime;
    }

    setDuration(updatedDuration: string) {
        this.duration = updatedDuration;
      } 

    // MARK: - Private 
}
