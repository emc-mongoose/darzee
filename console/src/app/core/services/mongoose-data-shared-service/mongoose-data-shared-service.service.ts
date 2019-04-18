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
  private currentAvailableMongooseNodes: MongooseRunNode[] = [];

  constructor() {
    this.configureDefaultMongooseRunNodes();
   }

   // MARK: - Public 

   public getAvailableRunNodes(): Observable<MongooseRunNode[]> { 
     return this.availableMongooseNodes$.asObservable();
   }
   
   public addMongooseRunNode(mongooseRunNode: MongooseRunNode) { 
     this.currentAvailableMongooseNodes.push(mongooseRunNode);
     this.availableMongooseNodes$.next(this.currentAvailableMongooseNodes);
   }
   // MARK: - Private 

   private configureDefaultMongooseRunNodes() { 
     // NOTE: Default Mongoose run node is an IP address. 
     let defaultMongooseRunNodeResource = `${environment.mongooseIp}:${environment.mongoosePort}`
    let defaultMongooseRunNode = new MongooseRunNode(defaultMongooseRunNodeResource, ResourceLocatorType.IP); 

    let defaultMongooseRunNodes = [defaultMongooseRunNode];

    this.currentAvailableMongooseNodes = defaultMongooseRunNodes;
    this.availableMongooseNodes$.next(defaultMongooseRunNodes)
   }
}
