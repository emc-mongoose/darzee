import { Time } from "@angular/common";

export class RunDuration { 
    startTime: Time;
    endTime: Time;

    constructor(startTime: Time, endTime: Time) { 
        this.startTime = startTime;
        this.endTime = endTime; 
        let date = new Date(String(endTime));
        console.log("Date.valueOf:" + date.valueOf())

    }
}