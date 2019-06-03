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
  readonly PROMETHEUS_HOST_ADDRESS_LOCAL_STORAGE_KEY = "mongoose-darzee-prometheus-host";

  private mongooseRunEntryNodes$: BehaviorSubject<MongooseRunEntryNode[]> = new BehaviorSubject<MongooseRunEntryNode[]>([]);

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  // MARK: - Public 

  /**
   * Save pair of "node address - run ID" into browser's local storage.
   * @param runEntryNodeAddress Mongoose entry node address that does run with ID @param runId
   * @param runId identifier of Mongoose run.
   */
  public saveToLocalStorage(runEntryNodeAddress: string, runId: string) {
    const currentEntryNodeMapAsObject: Object[] = this.storage.get(this.ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY) || [];

    let convertedEntryNodesMap: MongooseRunEntryNode[] = [];
    currentEntryNodeMapAsObject.forEach((rawEntryNode: Object) => {
      try {
        let entryNode: MongooseRunEntryNode = this.getEntryNodeFromObject(rawEntryNode);
        convertedEntryNodesMap.push(entryNode);
      } catch (castError) {
        console.error('Unable to cast object to MongooseRunEntryNode.');
      }
    });
    let newMongooseRunInstance = new MongooseRunEntryNode(runEntryNodeAddress, runId);
    convertedEntryNodesMap.push(newMongooseRunInstance);
    this.mongooseRunEntryNodes$.next(convertedEntryNodesMap);

    this.storage.set(this.ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY, convertedEntryNodesMap);
  }

  /**
   * 
   * Saves Prometheus' @param address into local storage.
   * Stores only 1 address at a time (at least for now).
   */
  public savePrometheusHostAddress(address: string) {
    // NOTE: As for now, we're storing only 1 Prometheus' host.
    const updatedArrayOfPrometheusHosts: string[] = [address];
    this.storage.set(this.PROMETHEUS_HOST_ADDRESS_LOCAL_STORAGE_KEY, updatedArrayOfPrometheusHosts);
  }


  /**
   * @returns Prometheus' server host address retrieved from local storage.
   * If nothing has been found at local storage, returns empty value.
   */
  public getPrometheusHostAddress(): string {
    let prometheusHostAddresses: string[] = this.storage.get(this.PROMETHEUS_HOST_ADDRESS_LOCAL_STORAGE_KEY) || [];
    const firstAddressIndex: number = 0;
    const emptyValue = "";

    let firstFoundAddress = prometheusHostAddresses[firstAddressIndex] || emptyValue;
    return firstFoundAddress;
  }

  /**
   * Searches for Mongoose run entry node with speciified @param runId .
   * @param runId ID of Mongoose run.
   * @returns Location of Mongoose run entry node (e.g.: IP address).
   */
  public getEntryNodeAddressForRunId(runId: string): MongooseRunEntryNode {
    let currentEntryNodeMap: MongooseRunEntryNode[] = this.storage.get(this.ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY) || [];
    this.mongooseRunEntryNodes$.next(currentEntryNodeMap);
    const firstFoundEntryIndex = 0;
    let matchingEntryFromLocalStorage: any = currentEntryNodeMap.filter((entry: any) => {
      return (entry.runId == runId);
    })[firstFoundEntryIndex] || "";
    let matchingEntryNodeAddress: string = MongooseRunEntryNode.EMPTY_ADDRESS;
    try {
      let matchingEntryNodeInstance: MongooseRunEntryNode = this.getEntryNodeFromObject(matchingEntryFromLocalStorage);
      matchingEntryNodeAddress = matchingEntryNodeInstance.getEntryNodeAddress();
    } catch (castException) {
      console.error(`Unable to cast object to entry node.`);
    }
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
          try {
            let entryNodeInstance: MongooseRunEntryNode = this.getEntryNodeFromObject(runEntryNode);
            let entryNodeAddress: string = entryNodeInstance.getEntryNodeAddress();
            nodeAddresses.push(entryNodeAddress);
          } catch (castException) {
            console.error(`Unable to cast object to entry node.`);
          }
        });
        return nodeAddresses;
      }));
  }
  
  // MARK: - Private 

  private getEntryNodeFromObject(object: any) {
    let nodeAddress = object.entryNodeAddress;
    let runId = object.runId;
    if ((nodeAddress == undefined) || (runId == undefined)) {
      throw new Error(`Unable to get entry node address from local storage entry.`)
    }
    return new MongooseRunEntryNode(nodeAddress, runId);
  }

}
