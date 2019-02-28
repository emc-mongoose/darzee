import { Injectable } from '@angular/core';
import { MongooseSetupInfoModel } from './mongoose-set-up-info.model';
import { ControlApiService } from 'src/app/core/services/control-api/control-api.service';
import { Constants } from 'src/app/common/constants';

@Injectable({
  providedIn: 'root'
})
export class MongooseSetUpService {

 private mongooseSetupInfoModel: MongooseSetupInfoModel; 

 // NOTE: Unprocessed values are the values that weren't validated via the confirmation button. 
 // Unprocessed parameters are Object types since the UI displays it, yet they could be modified within the service.
 // ... Passing them by reference (object-type), the UI will be updated automatically.
  unprocessedScenario: String; 
  private unprocessedConfiguration: Object; 
  private unprocessedNodeConfiguration: String[] = []; 

  constructor( private controlApiService: ControlApiService) { 
    this.mongooseSetupInfoModel = new MongooseSetupInfoModel(); 
    this.unprocessedConfiguration = this.controlApiService.getMongooseConfiguration(Constants.Configuration.MONGOOSE_HOST_IP);
  }


  // MARK: - Getters & Setters 

  setConfiguration(configuration: Object) { 
    this.mongooseSetupInfoModel.configuration = configuration;
  }

  setSenario(scenario: String) { 
    this.mongooseSetupInfoModel.scenario = scenario;
  }

  setNodesData(data: String[]) {
    this.mongooseSetupInfoModel.nodesData = data;
  }

  setUnprocessedConfiguration(configuration: Object) { 
    this.unprocessedConfiguration = configuration;
  }

  getUnprocessedConfiguration(): Object { 
    if (!this.unprocessedConfiguration) { 
      return;
    }
    if (this.mongooseSetupInfoModel.nodesData.length == 0) { 
      console.log("No additional nodes have been added.");
      return this.unprocessedConfiguration;
    }

    
    // NOTE: Returning configuration appended with slave nodes. 
    this.unprocessedConfiguration = this.getConfigurationWithSlaveNodes(this.mongooseSetupInfoModel.nodesData);
    return this.unprocessedConfiguration;
  }

  getSlaveNodesList(): String[] { 
    var slaveNodesList: String[] = this.unprocessedNodeConfiguration; 
    slaveNodesList.concat(this.mongooseSetupInfoModel.nodesData);
    return slaveNodesList;
  }

    // MARK: - Public 


  addNode(ip: String) { 
    if (this.isIpExist(ip)) { 
      alert ("IP " + ip + " has already been added to the slave-nodes list.");
      return;
    }
    this.unprocessedNodeConfiguration.push(ip);
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
    this.controlApiService.runMongoose(JSON.stringify(this.mongooseSetupInfoModel.configuration), this.mongooseSetupInfoModel.scenario);
  }

  // MARK: - Private

  private isIpExist(ip: String): boolean { 
    // NOTE: Prevent addition of duplicate IPs
    const isIpInUnprocessedList: boolean = this.unprocessedNodeConfiguration.includes(ip);
    const isIpInConfiguration: boolean = this.mongooseSetupInfoModel.nodesData.includes(ip);
    return ((isIpInUnprocessedList) || (isIpInConfiguration));
  }

  private getConfigurationWithSlaveNodes(slaveNodes: String[]): Object { 
    // NOTE: In order to prevent "non-existing-field" errors on Mongoose Configuration Object, ...
    // ... the configuration is copied into 'any'-typed variable. 
    // As for 28.02.2019, the slave nodes are stored within "load-step-node-addrs" field ...]
    // ... of Mongoose JSON cnfiguration. 
    var unprocessedConfigurationCopy: any = this.unprocessedConfiguration;
    unprocessedConfigurationCopy.load.step.node.addrs = slaveNodes;
    return unprocessedConfigurationCopy;
  }


}
