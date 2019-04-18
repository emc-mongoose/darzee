import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MongooseRunNode } from '../../models/mongoose-run-node.model';
import { environment } from 'src/environments/environment.prod';
import { ResourceLocatorType } from '../../models/address-type';

@Injectable({
  providedIn: 'root'
})
export class MongooseDataSharedServiceService {

  private availableMongooseNodes$: BehaviorSubject<MongooseRunNode[]> = new BehaviorSubject<MongooseRunNode[]>([])

  constructor() {
    this.configureDefaultMongooseRunNodes();
   }

   // MARK: - Private 
   private configureDefaultMongooseRunNodes() { 
     // NOTE: Default Mongoose run node is an IP address. 
     let defaultMongooseRunNodeResource = `${environment.mongooseIp}:${environment.mongoosePort}`;
    let defaultMongooseRunNode = new MongooseRunNode(defaultMongooseRunNodeResource, ResourceLocatorType.IP); 

    let defaultMongooseRunNodes = [defaultMongooseRunNode];
    this.availableMongooseNodes$.next(defaultMongooseRunNodes)
   }
}
