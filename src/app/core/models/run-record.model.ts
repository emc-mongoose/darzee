import { RunDuration } from '../run-duration';
import { MongooseRunStatus } from '../mongoose-run-status';

export class MongooseRunRecord { 

    constructor(status: MongooseRunStatus,  startTime: String, Nodes: String[],  duration: RunDuration, comment: String) { }

}