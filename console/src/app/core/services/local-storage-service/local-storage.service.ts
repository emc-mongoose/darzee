import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MongooseRunEntryNode } from './MongooseRunEntryNode';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Variable } from '@angular/compiler/src/render3/r3_ast';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  readonly ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY = "mongoose-darzee-entry-node-to-run-id-map";

  private mongooseRunEntryNodes$: BehaviorSubject<MongooseRunEntryNode[]> = new BehaviorSubject<MongooseRunEntryNode[]>([]);

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  // MARK: - Public 

  public saveToLocalStorage(runEntryNodeAddress: string, runId: string) {
    const currentEntryNodeMap = this.storage.get(this.ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY) || [];
    let newMongooseRunInstance = new MongooseRunEntryNode(runEntryNodeAddress, runId);
    currentEntryNodeMap.push(newMongooseRunInstance);
    this.mongooseRunEntryNodes$.next(currentEntryNodeMap);

    this.storage.set(this.ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY, currentEntryNodeMap);
  }

  public getEntryNodeAddressForRunId(runId: string): MongooseRunEntryNode {
    let currentEntryNodeMap: MongooseRunEntryNode[] = this.storage.get(this.ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY) || [];
    this.mongooseRunEntryNodes$.next(currentEntryNodeMap);

    const firstFoundEntryIndex = 0;
    let matchingEntryFromLocalStorage: any = currentEntryNodeMap.filter((entry: any) => {
      return (entry.runId == runId);
    })[firstFoundEntryIndex] || "";

    let matchingEntryNodeAddress = this.getEntryNodeAddressFromObject(matchingEntryFromLocalStorage);
    if (matchingEntryNodeAddress == undefined) {
      throw new Error(`Entry node address for run ID ${runId} doesn't exist within local storage.`);
    };

    return new MongooseRunEntryNode(matchingEntryNodeAddress, runId);
  }


  public getMongooseRunEntryNodes$(): Observable<MongooseRunEntryNode[]> {
    return this.mongooseRunEntryNodes$.asObservable();
  }

  public getMongooseRunEntryNodeAddresses$(): Observable<string[]> {
    return this.getMongooseRunEntryNodes$().pipe(
      map((runEntryNodes: MongooseRunEntryNode[]) => {
        var nodeAddresses: string[] = [];
        runEntryNodes.forEach((runEntryNode: Object) => {
          let runEntryNodeAddress: string = this.getEntryNodeAddressFromObject(runEntryNode);
          nodeAddresses.push(runEntryNodeAddress);
        });
        return nodeAddresses;
      }));
  }
  // MARK: - Private 

  private getEntryNodeAddressFromObject(object: any): string {
    let nodeAddress = object.entryNodeAddress;
    if (nodeAddress == undefined) {
      throw new Error(`Unable to get entry node address from local storage entry.`)
    }
    return nodeAddress;
  }

}
