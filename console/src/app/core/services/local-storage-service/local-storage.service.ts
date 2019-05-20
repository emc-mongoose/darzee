import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  readonly STORAGE_KEY = "mongoose-darzee";


  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  public saveToLocalStorage(runEntryNode: string, runId: string) { 
    const currentEntryNodeMap = this.storage.get(this.STORAGE_KEY) || [];
    console.log(`currentEntryNodeMap: ${JSON.stringify(currentEntryNodeMap)}`);
    currentEntryNodeMap.push({
      runEntryNode: `${runEntryNode}`,
      runId: `${runId}`
    });

    this.storage.set(this.STORAGE_KEY, currentEntryNodeMap);
    console.log(`updated currentEntryNodeMap: ${JSON.stringify(currentEntryNodeMap)}`);
  }
}
