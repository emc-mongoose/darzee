import { Injectable } from '@angular/core';
import { MongooseRunRecord } from '../../models/run-record.model';
import { MongooseRunStatus } from '../../mongoose-run-status';
import { RunDuration } from '../../run-duration';

@Injectable({
  providedIn: 'root'
})
export class MonitoringApiService {

  constructor() { }

  // MARK: - Public

  public getMongooseRunRecords(): MongooseRunRecord[] { 
    return this.generateMongooseRunRecords();
  }

  // MARK: - Private 
  
  // NOTE: Returning a hard-coded list in order to test the UI first. 
  private generateMongooseRunRecords(): MongooseRunRecord[] { 
    var resultRunList: MongooseRunRecord[] = [];
    const amountOfTestRecords = 10; 
    for (var i:number = 0; i < amountOfTestRecords; i++) { 
      const startTimeHexMock = this.generateHexStartTime();
      const endTimeHexMock = this.generateHexStartTime();
      const testNodesListMock = ["Node" + i, "Node" + i, "Node" + i];
      const durationMock = new RunDuration(startTimeHexMock, endTimeHexMock);
      const commentMock = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
      const runStatusMock = (i % 2) ? MongooseRunStatus.Finished : MongooseRunStatus.Running;
      let runRecord = new MongooseRunRecord(runStatusMock, startTimeHexMock,
         testNodesListMock, durationMock, commentMock); 
         if (runRecord.status == MongooseRunStatus.Finished) { 
          resultRunList.push(runRecord);
         }
      resultRunList.push(runRecord);
    }

    return resultRunList;
  }

  private generateHexStartTime(): string { 
    const currentDateTime = Date.now();
    const hexNumericSystemBase = 16; 
    return currentDateTime.toString(hexNumericSystemBase);
  }
}
