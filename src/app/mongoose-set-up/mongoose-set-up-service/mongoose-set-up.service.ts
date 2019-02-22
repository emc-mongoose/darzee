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
