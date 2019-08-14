import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MongooseRunEntryNode } from './MongooseRunEntryNode';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MongooseStoredRunNode } from './mongoose-stored-run-node.model';
import { MongooseRunNode } from '../../models/mongoose-run-node.model';
import { ResourceLocatorType } from '../../models/address-type';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY = "mongoose-darzee-entry-node-to-run-id-map";
  private readonly PROMETHEUS_HOST_ADDRESS_LOCAL_STORAGE_KEY = "mongoose-darzee-prometheus-host";
  private readonly STORING_NODES_ADDRESSES_LOCAL_STORAGE_KEY = "mongoose-darzee-stored-node-addresses";

  private mongooseRunEntryNodes$: BehaviorSubject<MongooseRunEntryNode[]> = new BehaviorSubject<MongooseRunEntryNode[]>([]);

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  // MARK: - Public 

  /**
   * Save pair of "node address - run ID" into browser's local storage.
   * @param runEntryNodeAddress Mongoose entry node address that does run with ID @param runId
   * @param runId identifier of Mongoose run.
   */
  public saveToLocalStorage(runEntryNodeAddress: string, runId: string) {
    const entryNodesMapLocalStorageKey: string = this.ENTRY_NODE_TO_RUN_ID_MAP_STORAGE_KEY;
    const currentEntryNodeMapAsObject: Object[] = this.storage.get(entryNodesMapLocalStorageKey) || [];

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

    this.storage.set(entryNodesMapLocalStorageKey, convertedEntryNodesMap);
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
   * Saved Mongoose run node (regardless whether it's an entry node or not) into local storage.
   * @param nodeAddress saving node's address.
   */
  public saveMongooseRunNode(savingNodeAddress: string) {
    const mongooseNodesLocalStorageKey: string = this.STORING_NODES_ADDRESSES_LOCAL_STORAGE_KEY;

    let currentStoredMongooseRunNodes: MongooseStoredRunNode[] = this.getStoredMongooseNodes();

    const isNodeDuplicate: boolean = this.hasStoredRunNodeBeenSaved(savingNodeAddress);
    if (isNodeDuplicate) {
      // // NOTE: Returning if saving node is already exist and its appearence status has been changed to non-hidden.
      return;
    }

    // NOTE: Node is not hidden by default.
    const shouldHideNewNode: boolean = false;
    let newRunNode: MongooseStoredRunNode = new MongooseStoredRunNode(savingNodeAddress, shouldHideNewNode);
    currentStoredMongooseRunNodes.push(newRunNode);

    this.storage.set(mongooseNodesLocalStorageKey, currentStoredMongooseRunNodes);
  }

  /**
   * Retrieves stored Mongoose nodes from local storge.
   * Note that some nodes could be non-entry.
   * @returns list of Mongoose run nodes found within local storage.
   */
  public getStoredMongooseNodes(): MongooseStoredRunNode[] {
    const mongooseNodesLocalStorageKey: string = this.STORING_NODES_ADDRESSES_LOCAL_STORAGE_KEY;
    let foundNodes: object[] = this.storage.get(mongooseNodesLocalStorageKey) || [];
    var storedMongooseNodes: MongooseStoredRunNode[] = [];
    foundNodes.forEach((rawFoundNode: object) => {
      try {
        let currentMongooseNode: MongooseStoredRunNode = this.getStoredNodeInstanceFromObject(rawFoundNode);
        storedMongooseNodes.push(currentMongooseNode);
      } catch (caseException) {
        console.error(`Unable to convert fond node ${JSON.stringify(rawFoundNode)} to Mongooose node instance.`);
      }
    })
    return storedMongooseNodes;
  }

  public getStoredMongooseNodesAddresses(): string[] {
    let storedNodeAddresses: string[] = [];

    let storedRunNodes: MongooseStoredRunNode[] = this.getStoredMongooseNodes();
    storedRunNodes.forEach((storedRunNode: MongooseStoredRunNode) => {
      const currentStoredNodeAddress: string = storedRunNode.address;
      storedNodeAddresses.push(currentStoredNodeAddress);
    });
    return storedNodeAddresses;
  }

  /**
   * Changed Mongoose run node address' status. 
   * Hidden status mean the node address won't be displaying within 'Nodes' selection table.
   * @param nodeAddress address of node to be removed from nodes table.
   */
  public changeNodeAddressHidingStatus(targetNodeAddress: string, isHidden: boolean) {
    let storedMongooseRunNodes: MongooseStoredRunNode[] = this.getStoredMongooseNodes();
    storedMongooseRunNodes.forEach(
      (runNode: MongooseStoredRunNode) => {
        if (runNode.address == targetNodeAddress) {
          runNode.isHidden = isHidden;
        }
      }
    );
    const storedMongooseRunNodesLocalStorageKey: string = this.STORING_NODES_ADDRESSES_LOCAL_STORAGE_KEY;
    this.storage.set(storedMongooseRunNodesLocalStorageKey, storedMongooseRunNodes);
  }

  /**
   * Checks nodes that were marked as hidden (e.g.: removed from node's screen.)
   * @returns list of hidden node addresses from local storage.
   */
  public getHiddenNodeAddresses(): string[] {
    const hiddenNodes: MongooseStoredRunNode[] = this.getStoredMongooseNodes();
    var hiddenNodeAddresses: string[] = [];
    hiddenNodes.forEach((storedRunNode: MongooseStoredRunNode) => {
      if (!storedRunNode.isHidden) {
        // NOTE: Returning only hidden nodes.
        return;
      }
      let currentHiddenNodeAddress: string = storedRunNode.address;
      hiddenNodeAddresses.push(currentHiddenNodeAddress);
    });
    return hiddenNodeAddresses;
  }

  /**
   * @returns Prometheus' server host address retrieved from local storage.
   * @returns empty value If nothing has been found at local storage.
   */
  public getPrometheusHostAddress(): string {
    let prometheusHostAddresses: string[] = this.storage.get(this.PROMETHEUS_HOST_ADDRESS_LOCAL_STORAGE_KEY) || [];
    const firstAddressIndex: number = 0;
    const emptyValue = "";
    console.log(`[${LocalStorageService.name}] Found Prometheus addresses: ${prometheusHostAddresses}.`);
    let firstFoundAddress = prometheusHostAddresses[firstAddressIndex] || emptyValue;
    console.log(`[${LocalStorageService.name}] First found address (${firstFoundAddress}) will be set as entry node.`);
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

  private getEntryNodeFromObject(object: any): MongooseRunEntryNode {
    let nodeAddress = object.entryNodeAddress;
    let runId = object.runId;
    if ((nodeAddress == undefined) || (runId == undefined)) {
      throw new Error(`Unable to get entry node address from local storage entry.`)
    }
    return new MongooseRunEntryNode(nodeAddress, runId);
  }

  private getStoredNodeInstanceFromObject(object: any): MongooseStoredRunNode {
    let address: string = object.address;
    let isHidden: boolean = object.isHidden;
    if ((address == undefined) || (isHidden == undefined)) {
      throw new Error(`Unable to get mongoose node address from local storage entry.`);
    }
    return new MongooseStoredRunNode(address, isHidden);
  }

  private hasStoredRunNodeBeenSaved(newStoredNodeAddress: string): boolean {
    const storedRunNodes: MongooseStoredRunNode[] = this.getStoredMongooseNodes();
    const isNodeExist: boolean = storedRunNodes.some((storedRunNode: MongooseStoredRunNode) => {
      return (storedRunNode.address == newStoredNodeAddress);
    });
    return isNodeExist;
  }

}
