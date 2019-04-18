import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MongooseRunNode } from '../../models/mongoose-run-node.model';
import { environment } from 'src/environments/environment';
import { ResourceLocatorType } from '../../models/address-type';

@Injectable({
  providedIn: 'root'
})
export class MongooseDataSharedServiceService {

  private availableMongooseNodes$: BehaviorSubject<MongooseRunNode[]> = new BehaviorSubject<MongooseRunNode[]>([])
  private mongooseRunNodes: MongooseRunNode[] = [];

  constructor() {
    this.configureDefaultMongooseRunNodes();
   }

   // MARK: - Public 

   public getAvailableRunNodes(): Observable<MongooseRunNode[]> { 
     return this.availableMongooseNodes$.asObservable();
   }
   
   public addMongooseRunNode(mongooseRunNode: MongooseRunNode) { 
     if (this.hasMongooseRunNodeBeenSaved(mongooseRunNode)) { 
      throw new Error(`Node with address "${mongooseRunNode.getResourceLocation()}" is already exist.`);
     }
     
     this.mongooseRunNodes.push(mongooseRunNode);
     this.availableMongooseNodes$.next(this.mongooseRunNodes);
   }

   // MARK: - Private 

   private configureDefaultMongooseRunNodes() { 
     // NOTE: Default Mongoose run node is an IP address. 
     let defaultMongooseRunNodeResource = `${environment.mongooseIp}:${environment.mongoosePort}`
    let defaultMongooseRunNode = new MongooseRunNode(defaultMongooseRunNodeResource, ResourceLocatorType.IP); 

    let defaultMongooseRunNodes = [defaultMongooseRunNode];

    this.mongooseRunNodes = defaultMongooseRunNodes;
    this.availableMongooseNodes$.next(defaultMongooseRunNodes)
   }

   private hasMongooseRunNodeBeenSaved(mongooseRunNode: MongooseRunNode): boolean { 
    var isNodeSaved = false;
    this.mongooseRunNodes.forEach(node => {
      let isLocationSame = (node.getResourceLocation() == mongooseRunNode.getResourceLocation());
      let isResourceTypeSame = (node.getResourceType() == mongooseRunNode.getResourceType());
      let isNodeSame = (isLocationSame && isResourceTypeSame);
      if (isNodeSame) { 
        isNodeSaved = true; 
        return; 
      }
    });
    return isNodeSaved;
   }
}
