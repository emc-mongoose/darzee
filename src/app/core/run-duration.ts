// TODO: Configure the class with respect to Mongoose API's part responsible for ...
// ... providing the duration of the run. As for now, the types are set to string. 
    
export class RunDuration { 
    startTime: string;
    endTime: string;

    constructor(startTime: string, endTime: string) { 
        this.startTime = startTime;
        this.endTime = endTime; 
    }
}