import { Injectable } from '@angular/core';
import { MongooseSetupInfoModel } from './mongoose-set-up-info.model';
import { NodeConfig } from 'src/app/core/services/ip-addresses/nodeConfig';

@Injectable({
  providedIn: 'root'
})
export class MongooseSetUpService {

 private mongooseSetupInfoModel: MongooseSetupInfoModel; 

 // NOTE: Unprocessed values are the values that weren't validated via the confirmation button. 
 unprocessedConfiguration: any; 
 unprocessedScenario: any; 
 unprocessedNodeConfiguration: NodeConfig[]; 

  constructor() { 
    this.mongooseSetupInfoModel = new MongooseSetupInfoModel(); 
  }

  // MARK: - Public 

  setConfiguration(configuration: any) { 
    this.mongooseSetupInfoModel.configuration = configuration;
  }

  setSenario(scenario: string) { 
    this.mongooseSetupInfoModel.scenario = scenario;
  }

  setNodesData(data: NodeConfig[]) {
    this.mongooseSetupInfoModel.nodesData = data;
  }

  // NOTE: Confirmation methods are used to validate the parameters which were set via "set" methods.
  // They're separated because of the specific UI. ("confirm" button is placed within the footer, ...
  // ... and set up pages are isplaying via <router-outler>. If user switches between set-up pages without...
  // ... confirmation, we could still retain the data inside an "unprocessed" variable (e.g.: unprocessedScenario))

  confirmConfigurationSetup() { 
    this.setSenario(this.unprocessedConfiguration);
  }

  confirmScenarioSetup() { 
    this.setSenario(this.unprocessedScenario);
  }

  confirmNodeConfiguration() { 
    this.setNodesData(this.unprocessedNodeConfiguration);
  }

  // MARK: - Private

}
