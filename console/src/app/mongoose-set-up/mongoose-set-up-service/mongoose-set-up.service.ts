import { Injectable } from '@angular/core';
import { MongooseSetupInfoModel } from './mongoose-set-up-info.model';
import { NodeConfig } from 'src/app/core/services/ip-addresses/nodeConfig';
import { ControlApiService } from 'src/app/core/services/control-api/control-api.service';

@Injectable({
  providedIn: 'root'
})
export class MongooseSetUpService {

 private mongooseSetupInfoModel: MongooseSetupInfoModel; 

 // NOTE: Unprocessed values are the values that weren't validated via the confirmation button. 
 unprocessedConfiguration: any; 
 unprocessedScenario: any; 
 unprocessedNodeConfiguration: NodeConfig[]; 

  constructor( private controlApiService: ControlApiService) { 
    this.mongooseSetupInfoModel = new MongooseSetupInfoModel(); 
  }

  // MARK: - Public 

  setConfiguration(configuration: string) { 
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
    this.setConfiguration(this.unprocessedConfiguration);
  }

  confirmScenarioSetup() { 
    const emptyJavascriptCode = "";
    // NOTE: Retain default scenario stored within mongooseSetupInfoModel. 
    if ((this.unprocessedScenario == emptyJavascriptCode) || (this.unprocessedScenario == undefined)) { 
      return;
    }
    this.setSenario(this.unprocessedScenario);
  }

  confirmNodeConfiguration() { 
    this.setNodesData(this.unprocessedNodeConfiguration);
  }

  runMongoose() { 
    // TODO: Add scenario and nodes.
    this.controlApiService.runMongoose(JSON.stringify(this.mongooseSetupInfoModel.configuration), this.mongooseSetupInfoModel.scenario);
  }

  // MARK: - Private

}