import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MongooseRunNode } from '../../models/mongoose-run-node.model';
import { environment } from 'src/environments/environment';
import { ResourceLocatorType } from '../../models/address-type';
import { MongooseRunNodesRepository } from '../../models/mongoose-run-nodes-repository';
import { LocalStorageService } from '../local-storage-service/local-storage.service';
import { MongooseRunEntryNode } from '../local-storage-service/MongooseRunEntryNode';

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
    return this.mongooseNodesRepository.getAvailableRunNodes();
  }

  /**
   * Adds @param mongooseRunNode  into Mongoose Run Node's repository.
   * @param mongooseRunNode new Mongoose run node 
   */
  public addMongooseRunNode(mongooseRunNode: MongooseRunNode) {
    const emptyAddress = "";
    if (mongooseRunNode.getResourceLocation() == emptyAddress) { 
      throw new Error(`Mongoose run node's address couldn't be empty.`);
    }
    this.mongooseNodesRepository.addMongooseRunNode(mongooseRunNode);
  }

  /**
   * Removes @param mongooseRunNode into Mongoose run nodes repository..
   * @param mongooseRunNode run node to be removed.
   */
  public deleteMongooseRunNode(mongooseRunNode: MongooseRunNode) {
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
        updatedEntryNodesList.forEach((entryNodeAddress: string) => {
          let entryNodeInstance = new MongooseRunNode(entryNodeAddress, ResourceLocatorType.IP);
          this.mongooseNodesRepository.addMongooseRunNode(entryNodeInstance);
        });
      }
    );

    // NOTE: Default Mongoose run node is an IP address. 
    let defaultMongooseRunNodeResource = `${environment.mongooseIp}:` + `${environment.mongoosePort}`
    let defaultMongooseRunNode = new MongooseRunNode(defaultMongooseRunNodeResource, ResourceLocatorType.IP);
    this.mongooseNodesRepository.addMongooseRunNode(defaultMongooseRunNode);
  }

}
