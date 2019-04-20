import { Injectable } from '@angular/core';
import { MongooseSetupInfoModel } from './mongoose-set-up-info.model';
import { ControlApiService } from 'src/app/core/services/control-api/control-api.service';
import { Constants } from 'src/app/common/constants';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PrometheusConfigurationEditor } from 'src/app/common/FileOperations/PrometheusConfigurationEditor';
import { FileFormat } from 'src/app/common/FileOperations/FileFormat';
import { ContainerServerService } from 'src/app/core/services/container-server/container-server-service';
import { map } from 'rxjs/operators';
import { MongooseRunNode } from '../../models/mongoose-run-node.model';
import { ResourceLocatorType } from '../../models/address-type';
import { MongooseConfigurationParser } from '../../models/mongoose-configuration-parser';

@Injectable({
  providedIn: 'root'
})
export class MongooseSetUpService {

  private mongooseSetupInfoModel: MongooseSetupInfoModel;

  // NOTE: Unprocessed values are the values that weren't validated via the confirmation button. 
  // Unprocessed parameters are Object types since the UI displays it, yet they could be modified within the service.
  // ... Passing them by reference (object-type), the UI will be updated automatically.
  public unprocessedScenario: String;

  private selectedMongooseRunNodes: MongooseRunNode[] = [];

  constructor(private controlApiService: ControlApiService,
    private containerServerService: ContainerServerService,
    private http: HttpClient) {

    this.updatePrometheusConfiguration();

    this.mongooseSetupInfoModel = new MongooseSetupInfoModel();
    this.controlApiService.getMongooseConfiguration(this.controlApiService.getMongooseIp())
      .subscribe((configuration: any) => {
        this.mongooseSetupInfoModel.setConfiguration(configuration);
        this.mongooseSetupInfoModel.setRunNodes(this.getSlaveNodesFromConfiguration(configuration));
      });
  }

  // MARK: - Getters & Setters 

  public getMongooseConfigurationForSetUp(): Observable<any> {
    let mongooseTargetAddress = `${Constants.Http.HTTP_PREFIX}${environment.mongooseIp}:${environment.mongoosePort}`;
    return this.controlApiService.getMongooseConfiguration(mongooseTargetAddress).pipe(
      map(
        (configuration: any) => {
          let mongooseConfigrationParser: MongooseConfigurationParser = new MongooseConfigurationParser(configuration);
          try {
            configuration = mongooseConfigrationParser.getConfigurationWithAdditionalNodes(this.selectedMongooseRunNodes);
          } catch (error) {
            console.error(`Nodes couldn't be inserted into configuration. Details: ${error}`);
          }
          return configuration;
        }
      )
    );
  }

  public getMongooseRunTargetPort(): String {
    return this.mongooseSetupInfoModel.getTargetRunPort();
  }



  public setConfiguration(configuration: Object) {
    this.mongooseSetupInfoModel.configuration = configuration;
  }

  public setSenario(scenario: String) {
    this.mongooseSetupInfoModel.scenario = scenario;
  }

  // MARK: - Public 


  public addNode(node: MongooseRunNode) {
    // NOTE: As for now, we're processing only IP addresses.
    if (node.getResourceType() == ResourceLocatorType.IP) {
      this.selectedMongooseRunNodes.push(node);
    }
  }


  // NOTE: Confirmation methods are used to validate the parameters which were set via "set" methods.
  // They're separated because of the specific UI. ("confirm" button is placed within the footer, ...
  // ... and set up pages are isplaying via <router-outler>. If user switches between set-up pages without...
  // ... confirmation, we could still retain the data inside an "unprocessed" variable (e.g.: unprocessedScenario))

 
  public confirmScenarioSetup() {
    const emptyJavascriptCode = "";
    // NOTE: Retain default scenario stored within mongooseSetupInfoModel. 
    if ((this.unprocessedScenario == emptyJavascriptCode) || (this.unprocessedScenario == undefined)) {
      return;
    }
    this.setSenario(this.unprocessedScenario);
  }

  public runMongoose(): Observable<String> {
    // NOTE: Updating Prometheus configuration with respect to Mongoose Run nodes. 
    this.updatePrometheusConfiguration();
    // NOTE: you can get related load step ID from mongoose setup model here. 
    return this.controlApiService.runMongoose(this.mongooseSetupInfoModel.configuration, this.mongooseSetupInfoModel.scenario).pipe(
      map(runId => {
        this.mongooseSetupInfoModel.setLoadStepId(runId);
        return runId;
      })
    );
  }

  // MARK: - Private

  private getSlaveNodesFromConfiguration(configuration: any): dtring[] {
    // NOTE: Retrieving existing slave nodes.
    let mongooseConfigurationParser = new MongooseConfigurationParser(configuration);
    return mongooseConfigurationParser.getNodes();
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
