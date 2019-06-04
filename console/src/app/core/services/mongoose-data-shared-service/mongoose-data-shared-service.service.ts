import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MongooseRunNode } from '../../models/mongoose-run-node.model';
import { environment } from 'src/environments/environment';
import { ResourceLocatorType } from '../../models/address-type';
import { MongooseRunNodesRepository } from '../../models/mongoose-run-nodes-repository';
import { LocalStorageService } from '../local-storage-service/local-storage.service';
import { MongooseRunEntryNode } from '../local-storage-service/MongooseRunEntryNode';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MongooseDataSharedServiceService {

  private mongooseNodesRepository: MongooseRunNodesRepository = new MongooseRunNodesRepository();

  constructor(private localStorageService: LocalStorageService) {
    try {
      this.setupMongooseNodesRepository();
    } catch (nodeExistError) {
      console.error(`An error has occured while setting up Mongoose nodes repositroy.`);
    }
  }

  // MARK: - Public 

  /**
   * Returns observable array of Mongoose run nodes within Mongoose node repository. 
   */
  public getAvailableRunNodes(): Observable<MongooseRunNode[]> {
    return this.mongooseNodesRepository.getAvailableRunNodes().pipe(
      map((availableRunNodes: MongooseRunNode[]) => {
        const hiddenNodesAddresses: string[] = this.localStorageService.getHiddenNodeAddresses();
        availableRunNodes = availableRunNodes.filter(
          (currentNode: MongooseRunNode) => { 
            const nodeAddress: string = currentNode.getResourceLocation();
            const shouldRetainNode: boolean = (!hiddenNodesAddresses.includes(nodeAddress)); 
            return shouldRetainNode;
          }
        )
        return availableRunNodes;
      }
      ));
  }

  /**
   * Adds @param mongooseRunNode  into Mongoose Run Node's repository.
   * @param mongooseRunNode new Mongoose run node 
   */
  public addMongooseRunNode(mongooseRunNode: MongooseRunNode, hasNodesBeenHiddenFromNodesList: boolean = false) {
    const emptyAddress = "";
    if (mongooseRunNode.getResourceLocation() == emptyAddress) {
      throw new Error(`Mongoose run node's address couldn't be empty.`);
    }
    if (hasNodesBeenHiddenFromNodesList) { 
      this.mongooseNodesRepository.deleteMongooseRunNode(mongooseRunNode);
    }
    this.mongooseNodesRepository.addMongooseRunNode(mongooseRunNode);
  }

  /**
   * Removes @param mongooseRunNode into Mongoose run nodes repository..
   * @param mongooseRunNode run node to be removed.
   */
  public deleteMongooseRunNode(mongooseRunNode: MongooseRunNode) {
    const removedNodeAddress: string = mongooseRunNode.getResourceLocation();
    const shouldHideRemovalNodeAddress: boolean = true;

    this.localStorageService.changeNodeAddressHidingStatus(removedNodeAddress, shouldHideRemovalNodeAddress);
    this.mongooseNodesRepository.deleteMongooseRunNode(mongooseRunNode);
  }

  // MARK: - Private 

  private setupMongooseNodesRepository() {
    // NOTE: Adding nodes from Local Storage in order to fulfill the nodes list.
    this.localStorageService.getMongooseRunEntryNodeAddresses$().subscribe(
      (updatedEntryNodesList: string[]) => {
        if (updatedEntryNodesList == undefined) {
          return;
        }
        const hiddenNodeAddresses: string[] = this.localStorageService.getHiddenNodeAddresses();

        updatedEntryNodesList.forEach((entryNodeAddress: string) => {
          // NOTE: Saving entry node addresses from local storage.
          if (hiddenNodeAddresses.includes(entryNodeAddress)) { 
            return; 
          }
          let entryNodeInstance = new MongooseRunNode(entryNodeAddress, ResourceLocatorType.IP);
          this.mongooseNodesRepository.addMongooseRunNode(entryNodeInstance);
        });


        let storedNodeAddresses: string[] = this.localStorageService.getStoredMongooseNodesAddresses();
        storedNodeAddresses.forEach((nodeAddress: string) => {
          if (hiddenNodeAddresses.includes(nodeAddress)) { 
            return; 
          }
          // NOTE: Saving node addresses from local storage.;
          let nodeInstance: MongooseRunNode = new MongooseRunNode(nodeAddress, ResourceLocatorType.IP);
          this.mongooseNodesRepository.addMongooseRunNode(nodeInstance);
        });
      }
    );

    // NOTE: Default Mongoose run node is an IP address. 
    let defaultMongooseRunNodeResource = `${environment.mongooseIp}:` + `${environment.mongoosePort}`
    let defaultMongooseRunNode = new MongooseRunNode(defaultMongooseRunNodeResource, ResourceLocatorType.IP);
    this.mongooseNodesRepository.addMongooseRunNode(defaultMongooseRunNode);
  }

}
