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
    this.setupMongooseNodesRepository();
  }

  // MARK: - Public 

  public getAvailableRunNodes(): Observable<MongooseRunNode[]> {
    return this.mongooseNodesRepository.getAvailableRunNodes();
  }

  public addMongooseRunNode(mongooseRunNode: MongooseRunNode) {
    this.mongooseNodesRepository.addMongooseRunNode(mongooseRunNode);
  }

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
