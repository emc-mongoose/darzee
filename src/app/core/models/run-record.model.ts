import { RunDuration } from '../run-duration';
import { MongooseRunStatus } from '../mongoose-run-status';

export interface MongooseRunRecord { 
    status: MongooseRunStatus; 
    startTime: String;
    Nodes: String[]; 
    Duration: RunDuration; 
    comment: String;
}