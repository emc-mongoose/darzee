import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  readonly ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY = "mongoose-darzee-entry-node-to-run-id-map";


  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  public saveToLocalStorage(runEntryNode: string, runId: string) { 
    const currentEntryNodeMap = this.storage.get(this.ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY) || [];
    currentEntryNodeMap.push({
      runEntryNode: `${runEntryNode}`,
      runId: `${runId}`
    });

    this.storage.set(this.ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY, currentEntryNodeMap);
    console.log(`updated currentEntryNodeMap: ${JSON.stringify(currentEntryNodeMap)}`);
  }
}
