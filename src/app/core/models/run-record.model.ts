import { RunDuration } from '../run-duration';
import { MongooseRunStatus } from '../mongoose-run-status';

export class MongooseRunRecord { 

    constructor(status: MongooseRunStatus,  startTime: String, nodes: String[],  duration: RunDuration, comment: String) { }

}