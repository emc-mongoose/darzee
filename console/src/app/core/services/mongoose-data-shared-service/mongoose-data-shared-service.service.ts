import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MongooseRunNode } from '../../models/mongoose-run-node.model';
import { environment } from 'src/environments/environment';
import { ResourceLocatorType } from '../../models/address-type';
import { MongooseRunNodesRepository } from '../../models/mongoose-run-nodes-repository';

@Injectable({
  providedIn: 'root'
})
export class MongooseDataSharedServiceService {

  private mongooseNodesRepository: MongooseRunNodesRepository = new MongooseRunNodesRepository(); 

  constructor() {
    this.setupMongooseNodesRepository();
   }

   // MARK: - Public 

   public getAvailableRunNodes(): Observable<MongooseRunNode[]> { 
     return this.mongooseNodesRepository.getAvailableRunNodes(); 
   }
   
   public addMongooseRunNode(mongooseRunNode: MongooseRunNode) { 
      this.mongooseNodesRepository.addMongooseRunNode(mongooseRunNode);
   }

   // MARK: - Private 

   private setupMongooseNodesRepository() { 
     // NOTE: Default Mongoose run node is an IP address. 
    let defaultMongooseRunNodeResource = `${environment.mongooseIp}:${environment.mongoosePort}`
    let defaultMongooseRunNode = new MongooseRunNode(defaultMongooseRunNodeResource, ResourceLocatorType.IP); 
    this.mongooseNodesRepository.addMongooseRunNode(defaultMongooseRunNode);
   }

}
