import { Injectable } from '@angular/core';
import { MongooseSetupInfoModel } from './mongoose-set-up-info.model';
import { ControlApiService } from 'src/app/core/services/control-api/control-api.service';
import { Constants } from 'src/app/common/constants';
import { Observable, BehaviorSubject } from 'rxjs';
import { DateFormatPipe } from 'src/app/common/date-format-pipe';

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

  constructor(private controlApiService: ControlApiService,
    private dateFormatPipe: DateFormatPipe) {

    this.mongooseSetupInfoModel = new MongooseSetupInfoModel(this.observableSlaveNodes);
    this.unprocessedConfiguration = this.controlApiService.getMongooseConfiguration(Constants.Configuration.MONGOOSE_HOST_IP)
      .subscribe((configuration: any) => {
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
    this.observableSlaveNodes.next(data);
    this.mongooseSetupInfoModel.nodesData = data;
  }

  setUnprocessedConfiguration(configuration: Object) {
    this.unprocessedConfiguration = configuration;
  }

  getUnprocessedConfiguration(): Object {
    if (this.mongooseSetupInfoModel.nodesData.length == 0) {
      console.log("No additional nodes have been added.");
      return this.unprocessedConfiguration;
    }

    try {
      let targetConfiguration: any = this.unprocessedConfiguration;
      if (!this.isSlaveNodesFieldExistInConfiguration(targetConfiguration)) {
        let misleadingMsg = "Unable to find slave nodes within the confguration ('addrs' field).";
        throw new Error(misleadingMsg);
      }
      targetConfiguration.load.step.node.addrs = this.mongooseSetupInfoModel.nodesData;
      this.unprocessedConfiguration = targetConfiguration;
    } catch (error) {
      alert("Unable to add additional nodes to set up. Reason: " + error);
    }

    return this.unprocessedConfiguration;
  }

  getSlaveNodesList(): String[] {
    var slaveNodesList: String[] = this.observableSlaveNodes.getValue();
    slaveNodesList.concat(this.mongooseSetupInfoModel.nodesData);
    return slaveNodesList;
  }

  // MARK: - Public 


  addNode(ip: String) {
    if (this.isIpExist(ip)) {
      alert("IP " + ip + " has already been added to the slave-nodes list.");
      return;
    }
    const currentSlaveNodesList = this.observableSlaveNodes.getValue();
    currentSlaveNodesList.push(ip);
    this.observableSlaveNodes.next(currentSlaveNodesList);
  }

  deleteSlaveNode(nodeAddress: String) {
    // NOTE: Retaining IP addresses that doesn't match deleting IP. 
    const filtredNodesList = this.observableSlaveNodes.getValue().filter(ipAddress => {
      nodeAddress != ipAddress;
    });
    this.observableSlaveNodes.next(filtredNodesList);
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
    this.setNodesData(this.observableSlaveNodes.getValue());
  }

  runMongoose() {
    try { 
      if (!this.mongooseSetupInfoModel.hasLoadStepId()) {
        let generatedLoadStepId = this.getGeneratedLoadStepId();
        this.mongooseSetupInfoModel.setLoadStepId(generatedLoadStepId);
      }
    } catch (configurationError) { 
      let misleadingMsg = "Unable to apply generated load step id to Mongoose run configuration. Reason: " + configurationError; 
      console.error(misleadingMsg);
    }
    this.controlApiService.runMongoose(this.mongooseSetupInfoModel.configuration, this.mongooseSetupInfoModel.scenario).subscribe(mongooseRunId => {
      console.log("Launched Mongoose run with run ID: ", mongooseRunId);
      console.log("Related load step ID: ", this.mongooseSetupInfoModel.getLoadStepId());
    });
  }

  // MARK: - Private

  private getGeneratedLoadStepId(): String {
    // NOTE: Load step ID parretn is <STEP_TYPE>-<yyyyMMdd.HHmmss.SSS>
    let stepTypeMock = "none"; // TODO: get actual step type 
    let formattedDate = this.dateFormatPipe.transform(new Date());
    console.log("formattedDate: ", formattedDate);

    let loadStepId = "<${stepType}>-<y${formattedDate}>"
    return loadStepId;

  }

  private isIpExist(ip: String): boolean {
    // NOTE: Prevent addition of duplicate IPs
    const isIpInUnprocessedList: boolean = this.observableSlaveNodes.getValue().includes(ip);
    const isIpInConfiguration: boolean = this.mongooseSetupInfoModel.nodesData.includes(ip);
    return ((isIpInUnprocessedList) || (isIpInConfiguration));
  }


  private getSlaveNodesFromConfiguration(configuration: any): String[] {
    // NOTE: Retrieving existing slave nodes.
    console.log("target configuration: " + JSON.stringify(configuration));
    if (!this.isSlaveNodesFieldExistInConfiguration(configuration)) {
      let misleadingMsg = "Unable to find slave nodes field within the Mongoose configuration.";
      alert(misleadingMsg);
      const emptyList = [];
      return emptyList;
    }
    const slaveNodesList: String[] = configuration.load.step.node.addrs;
    return slaveNodesList;
  }

  private isSlaveNodesFieldExistInConfiguration(configuration: any): boolean {
    // NOTE: Check if 'Address' field exists on received Mongoose JSON configuration. 
    // As for 04.03.2019, it's located at load -> step -> node -> addrs
    return !((configuration.load == undefined) &&
      (configuration.load.step == undefined) &&
      (configuration.load.step.node == undefined) &&
      (configuration.load.step.node.addrs == undefined));
  }

}
