import { Injectable } from '@angular/core';
import { MongooseSetupInfoModel } from './mongoose-set-up-info.model';
import { ControlApiService } from 'src/app/core/services/control-api/control-api.service';
import { Constants } from 'src/app/common/constants';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MongooseSetUpService {

 private mongooseSetupInfoModel: MongooseSetupInfoModel; 

 // NOTE: Unprocessed values are the values that weren't validated via the confirmation button. 
 // Unprocessed parameters are Object types since the UI displays it, yet they could be modified within the service.
 // ... Passing them by reference (object-type), the UI will be updated automatically.
  unprocessedScenario: String; 

  private observableSlaveNodes: BehaviorSubject<String[]> = new BehaviorSubject<String[]>([]); 

  private unprocessedConfiguration: Object; 
  private unprocessedNodeConfiguration: String[] = []; 

  constructor( private controlApiService: ControlApiService) { 

    this.observableSlaveNodes = new BehaviorSubject<String[]>([]);

    this.mongooseSetupInfoModel = new MongooseSetupInfoModel(); 
    this.unprocessedConfiguration = this.controlApiService.getMongooseConfiguration(Constants.Configuration.MONGOOSE_HOST_IP)
      .subscribe( (configuration: any) => { 
        this.mongooseSetupInfoModel.configuration = configuration;
        this.mongooseSetupInfoModel.nodesData = this.getSlaveNodesFromConfiguration(configuration);
        this.observableSlaveNodes.next(this.mongooseSetupInfoModel.nodesData);

      });
  }


  // MARK: - Getters & Setters 

  public getObservableSlaveNodes(): Observable<String[]> { 
    return this.observableSlaveNodes.asObservable();
  }

  setConfiguration(configuration: Object) { 
    this.mongooseSetupInfoModel.configuration = configuration;
  }

  setSenario(scenario: String) { 
    this.mongooseSetupInfoModel.scenario = scenario;
  }

  setNodesData(data: String[]) {
    console.log("nodes data has been set.");
    this.observableSlaveNodes.next(data);
    this.mongooseSetupInfoModel.nodesData = data;
  }

  setUnprocessedConfiguration(configuration: Object) { 
    this.unprocessedConfiguration = configuration;
  }

  getUnprocessedConfiguration(): Object { 
    if (this.unprocessedConfiguration == undefined) { 
      return this.mongooseSetupInfoModel.nodesData;
    }

    if (this.mongooseSetupInfoModel.nodesData.length == 0) { 
      console.log("No additional nodes have been added.");
      return this.unprocessedConfiguration;
    }

    // NOTE: Returning configuration appended with slave nodes. 
    // this.unprocessedConfiguration = this.getConfigurationWithSlaveNodes(this.mongooseSetupInfoModel.nodesData);
    
    return this.mongooseSetupInfoModel.nodesData;
  }

  getSlaveNodesList(): String[] { 
    var slaveNodesList: String[] = this.unprocessedNodeConfiguration; 
    slaveNodesList.concat(this.mongooseSetupInfoModel.nodesData);
    return slaveNodesList;
  }

  observeSlaveNodesChange(): Observable<String[]> { 
    return new Observable();
  }

    // MARK: - Public 


  addNode(ip: String) { 
    if (this.isIpExist(ip)) { 
      alert ("IP " + ip + " has already been added to the slave-nodes list.");
      return;
    }
    const currentSlaveNodesList = this.observableSlaveNodes.getValue();
    currentSlaveNodesList.push(ip);
    this.observableSlaveNodes.next(currentSlaveNodesList);
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
    const isIpInUnprocessedList: boolean = this.observableSlaveNodes.getValue().includes(ip); 
    const isIpInConfiguration: boolean = this.mongooseSetupInfoModel.nodesData.includes(ip);
    return ((isIpInUnprocessedList) || (isIpInConfiguration));
  }


  private getSlaveNodesFromConfiguration(configuration: any): String[] { 
    // NOTE: Retrieving existing slave nodes.
    console.log("target configuration: " + JSON.stringify(configuration));
    const slaveNodesList: String[] = configuration.load.step.node.addrs;
    if (slaveNodesList == undefined) { 
      console.error("Unable to read slave nodes from configuration. Possible Mongoose's configuration JSON change.");
      const emptyList = [];
      return emptyList;
    }
    return slaveNodesList;
  }

}
