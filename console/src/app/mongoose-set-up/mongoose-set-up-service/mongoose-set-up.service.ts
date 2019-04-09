import { Injectable } from '@angular/core';
import { MongooseSetupInfoModel } from './mongoose-set-up-info.model';
import { ControlApiService } from 'src/app/core/services/control-api/control-api.service';
import { Constants } from 'src/app/common/constants';
import { Observable, BehaviorSubject, config } from 'rxjs';
import { DateFormatPipe } from 'src/app/common/date-format-pipe';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PrometheusConfigurationEditor } from 'src/app/common/FileOperations/PrometheusConfigurationEditor';
import { FileFormat } from 'src/app/common/FileOperations/FileFormat';
import { ContainerServerService } from 'src/app/core/services/container-server/container-server-service';
import { PrometheusApiService } from 'src/app/core/services/prometheus-api/prometheus-api.service';

@Injectable({
  providedIn: 'root'
})
export class MongooseSetUpService {

  private mongooseSetupInfoModel: MongooseSetupInfoModel;

  // NOTE: Unprocessed values are the values that weren't validated via the confirmation button. 
  // Unprocessed parameters are Object types since the UI displays it, yet they could be modified within the service.
  // ... Passing them by reference (object-type), the UI will be updated automatically.
  unprocessedScenario: String;

  private slaveNodes$: BehaviorSubject<String[]> = new BehaviorSubject<String[]>([]);
  private unprocessedConfiguration: Object;

  constructor(private controlApiService: ControlApiService,
    private containerServerService: ContainerServerService,
    private prometheusApiService: PrometheusApiService,
    private http: HttpClient,
    private dateFormatPipe: DateFormatPipe) {

    this.updatePrometheusConfiguration();
    this.mongooseSetupInfoModel = new MongooseSetupInfoModel(this.slaveNodes$);
    this.unprocessedConfiguration = this.controlApiService.getMongooseConfiguration(Constants.Configuration.MONGOOSE_HOST_IP)
      .subscribe((configuration: any) => {
        this.mongooseSetupInfoModel.configuration = configuration;
        this.mongooseSetupInfoModel.nodesData = this.getSlaveNodesFromConfiguration(configuration);
        this.slaveNodes$.next(this.mongooseSetupInfoModel.nodesData);
      });
  }


  // MARK: - Getters & Setters 

  public getMongooseRunTargetPort(): String {
    return this.mongooseSetupInfoModel.getTargetRunPort();
  }

  public getSlaveNodes(): Observable<String[]> {
    return this.slaveNodes$.asObservable();
  }

  public setConfiguration(configuration: Object) {
    this.mongooseSetupInfoModel.configuration = configuration;
  }

  public setSenario(scenario: String) {
    this.mongooseSetupInfoModel.scenario = scenario;
  }

  public setNodesData(data: String[]) {
    this.slaveNodes$.next(data);
    this.mongooseSetupInfoModel.nodesData = data;
  }

  public setUnprocessedConfiguration(configuration: Object) {
    this.unprocessedConfiguration = configuration;
  }

  public getUnprocessedConfiguration(): Object {

    if (!this.isSlaveNodesFieldExistInConfiguration(this.unprocessedConfiguration)) {
      let misleadingMsg = "Unable to find slave nodes within the confguration ('addrs' field).";
      throw new Error(misleadingMsg);
    }

    if (this.mongooseSetupInfoModel.nodesData.length == 0) {
      console.log("No additional nodes have been added.");
      return this.unprocessedConfiguration;
    }

    try {
      let targetConfiguration: any = this.unprocessedConfiguration;
      targetConfiguration.load.step.node.addrs = this.mongooseSetupInfoModel.nodesData;
      this.unprocessedConfiguration = targetConfiguration;
    } catch (error) {
      alert("Unable to add additional nodes to set up. Reason: " + error);
    }

    return this.unprocessedConfiguration;
  }

  public getSlaveNodesList(): String[] {
    var slaveNodesList: String[] = this.slaveNodes$.getValue();
    slaveNodesList.concat(this.mongooseSetupInfoModel.nodesData);
    return slaveNodesList;
  }

  // MARK: - Public 


  public addNode(ip: String) {
    if (this.isIpExist(ip)) {
      alert("IP " + ip + " has already been added to the slave-nodes list.");
      return;
    }
    const currentSlaveNodesList = this.slaveNodes$.getValue();
    currentSlaveNodesList.push(ip);
    this.slaveNodes$.next(currentSlaveNodesList);
  }

  public deleteSlaveNode(nodeAddress: String) {
    // NOTE: Retaining IP addresses that doesn't match deleting IP. 
    const filtredNodesList = this.slaveNodes$.getValue().filter(ipAddress => {
      nodeAddress != ipAddress;
    });
    this.slaveNodes$.next(filtredNodesList);
  }

  // NOTE: Confirmation methods are used to validate the parameters which were set via "set" methods.
  // They're separated because of the specific UI. ("confirm" button is placed within the footer, ...
  // ... and set up pages are isplaying via <router-outler>. If user switches between set-up pages without...
  // ... confirmation, we could still retain the data inside an "unprocessed" variable (e.g.: unprocessedScenario))

  public confirmConfigurationSetup() {
    this.setConfiguration(this.unprocessedConfiguration);
  }

  public confirmScenarioSetup() {
    const emptyJavascriptCode = "";
    // NOTE: Retain default scenario stored within mongooseSetupInfoModel. 
    if ((this.unprocessedScenario == emptyJavascriptCode) || (this.unprocessedScenario == undefined)) {
      return;
    }
    this.setSenario(this.unprocessedScenario);
  }

  public confirmNodeConfiguration() {
    this.setNodesData(this.slaveNodes$.getValue());
  }

  public runMongoose(): Observable<String> {

    // NOTE: Updating Prometheus configuration with respect to Mongoose Run nodes. 
    this.updatePrometheusConfiguration(); 

    try {
      if (!this.mongooseSetupInfoModel.hasLoadStepId()) {
        let generatedLoadStepId = this.getGeneratedLoadStepId();
        this.mongooseSetupInfoModel.setLoadStepId(generatedLoadStepId);
      }
    } catch (configurationError) {
      let misleadingMsg = "Unable to apply generated load step id to Mongoose run configuration. Reason: " + configurationError;
      console.error(misleadingMsg);
    }
    // NOTE: you can get related load step ID from mongoose setup model here. 
    return this.controlApiService.runMongoose(this.mongooseSetupInfoModel.configuration, this.mongooseSetupInfoModel.scenario);
  }

  // MARK: - Private

  private getGeneratedLoadStepId(): String {
    // NOTE: Load step ID parretn is <STEP_TYPE>-<yyyyMMdd.HHmmss.SSS>
    let stepTypeMock = "none"; // TODO: get actual step type 
    let formattedDate = this.dateFormatPipe.transform(new Date());
    let loadStepId = stepTypeMock + "-" + formattedDate;
    return loadStepId;

  }

  private isIpExist(ip: String): boolean {
    // NOTE: Prevent addition of duplicate IPs
    const isIpInUnprocessedList: boolean = this.slaveNodes$.getValue().includes(ip);
    const isIpInConfiguration: boolean = this.mongooseSetupInfoModel.nodesData.includes(ip);
    return ((isIpInUnprocessedList) || (isIpInConfiguration));
  }


  private getSlaveNodesFromConfiguration(configuration: any): String[] {
    // NOTE: Retrieving existing slave nodes.
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

  private updatePrometheusConfiguration() {
    // NOTE: An initial fetch of Prometheus configuration.
    this.http.get(environment.prometheusConfigPath, { responseType: 'text' }).subscribe((configurationFileContent: Object) => {
      console.log(`File content for configuration on path ${environment.prometheusConfigPath} is : ${configurationFileContent}`);
      let prometheusConfigurationEditor: PrometheusConfigurationEditor = new PrometheusConfigurationEditor(configurationFileContent);
      
      let updatedConfiguration = prometheusConfigurationEditor.addTargetsToConfiguration(this.mongooseSetupInfoModel.nodesData);  
      // NOTE: Saving prometheus configuration in .yml file. 
      let prometheusConfigFileName = `${Constants.FileNames.PROMETHEUS_CONFIGURATION}.${FileFormat.YML}`;
      this.containerServerService.saveFile(prometheusConfigFileName, updatedConfiguration as string).subscribe(response => { 
        console.log(`Container server response on file save: ${JSON.stringify(response)}. Prometheus will be eventually reloaded.`);
        // NOTE: Prometheus reloads itself once configuration is udpated. 
        this.containerServerService.requestPrometheusReload().subscribe(prometheusReloadResult => { 
          console.log(`Prometheus reload response: ${JSON.stringify(prometheusReloadResult)}`);
        })
      })
    });

  }
}
