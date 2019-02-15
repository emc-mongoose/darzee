import { RunDuration } from './run-duration';

export interface RunRecord { 
    status: String; 
    startTime: String;
    Nodes: String[]; 
    Duration: RunDuration; 
    comment: String;
}