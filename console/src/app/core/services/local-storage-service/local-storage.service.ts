import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MongooseRunEntryNode } from './MongooseRunEntryNode';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  readonly ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY = "mongoose-darzee-entry-node-to-run-id-map";


  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  public saveToLocalStorage(runEntryNodeAddress: string, runId: string) { 
    const currentEntryNodeMap = this.storage.get(this.ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY) || [];
    let newMongooseRunInstance = new MongooseRunEntryNode(runEntryNodeAddress, runId);
    currentEntryNodeMap.push(newMongooseRunInstance);

    this.storage.set(this.ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY, currentEntryNodeMap);
  }

  public getEntryNodeAddressForRunId(runId: string): MongooseRunEntryNode { 
    let currentEntryNodeMap: MongooseRunEntryNode[] = this.storage.get(this.ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY) || [];

    const firstFoundEntryIndex = 0;
    let matchingEntryFromLocalStorage: any = currentEntryNodeMap.filter((entry: any) => { 
      let entryRunId = entry.runId;
      if (entryRunId == undefined) { 
        return false; 
      }
      return (entry.runId == runId);
    })[firstFoundEntryIndex];

    let matchingEntryNodeAddress = matchingEntryFromLocalStorage.runEntryNode; 
    if (matchingEntryNodeAddress == undefined) { 
      throw new Error(`Entry node address for run ID ${runId} doesn't exist within local storage.`);
    };

    return new MongooseRunEntryNode(matchingEntryNodeAddress, runId);
  }
}
