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
import { LocalStorageService } from '../local-storage-service/local-storage.service';
import { MonitoringApiService } from '../monitoring-api/monitoring-api.service';
import { PrometheusApiService } from '../prometheus-api/prometheus-api.service';

@Injectable({
  providedIn: 'root'
})
export class MongooseSetUpService {

  private mongooseSetupInfoModel: MongooseSetupInfoModel;

  constructor(private controlApiService: ControlApiService,
    private monitoringApiService: MonitoringApiService,
    private containerServerService: ContainerServerService,
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private prometheusApiService: PrometheusApiService) {

    this.mongooseSetupInfoModel = new MongooseSetupInfoModel();
    this.controlApiService.getMongooseConfiguration(this.controlApiService.getMongooseIp())
      .subscribe((configuration: any) => {
        this.mongooseSetupInfoModel.setConfiguration(configuration);
        this.mongooseSetupInfoModel.setRunNodes(this.getSlaveNodesFromConfiguration(configuration));
      });
  }

  // MARK: - Getters & Setters 

  public getMongooseConfigurationForSetUp(entryNode: MongooseRunNode): Observable<any> {
    if (entryNode == undefined) {
      throw new Error(`Can't get configuration snce entry node ins an undefined.`);
    }
    let mongooseTargetAddress = `${Constants.Http.HTTP_PREFIX}${entryNode.getResourceLocation()}`;
    return this.controlApiService.getMongooseConfiguration(mongooseTargetAddress).pipe(
      map(
        (configuration: any) => {
          let mongooseConfigrationParser: MongooseConfigurationParser = new MongooseConfigurationParser(configuration);
          try {
            let additionalNodes: MongooseRunNode[] = this.mongooseSetupInfoModel.getSlaveNodesList(entryNode);
            configuration = mongooseConfigrationParser.getConfigurationWithAdditionalNodes(additionalNodes);
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

  public setConfiguration(mongooseConfiguration: any) {
    this.mongooseSetupInfoModel.setConfiguration(mongooseConfiguration);
  }

  public setSenario(mongooseRunScenario: String) {
    this.mongooseSetupInfoModel.setRunScenario(mongooseRunScenario);
  }

  // MARK: - Public 

  public getSelectedMongooseRunNodes(): MongooseRunNode[] {
    return this.mongooseSetupInfoModel.getFullRunNodesList();
  }

  public isNodeExist(node: MongooseRunNode): boolean {
    return this.mongooseSetupInfoModel.isNodeAlreadyExist(node);
  }

  public getMongooseEntryNode(): MongooseRunNode {
    // NOTE: First node from the list counts as the entry one. 
    const firstNodeIndex = 0;
    return this.mongooseSetupInfoModel.getFullRunNodesList()[firstNodeIndex];
  }


  public isMongooseNodeActive(mongooseNodeAddress: string): Observable<boolean> {
    return this.monitoringApiService.isMongooseRunNodeActive(mongooseNodeAddress);
  }

  // NOTE: Adding Mongoose nodes (while node selection)
  public addNode(node: MongooseRunNode) {
    this.mongooseSetupInfoModel.addRunNode(node);
  }

  public removeNode(node: MongooseRunNode) {
    this.mongooseSetupInfoModel.removeRunNode(node);
  }


  public runMongoose(entryNode: MongooseRunNode): Observable<String> {

    // NOTE: Updating Prometheus configuration with respect to Mongoose Run nodes. 
    let mongooseRunNodesList: string[] = this.mongooseSetupInfoModel.getStringifiedNodesForDistributedMode();
    this.prometheusApiService.getCurrentAddress().subscribe(
      (prometheusAddressWithPort: string) => {
        const portAndAddressDelimiter = ":";
        let prometheusAddressParams: string[] = prometheusAddressWithPort.split(portAndAddressDelimiter);
        const prometheusAddress: string = prometheusAddressParams[0] || environment.prometheusIp;
        var prometheusPort: string = prometheusAddressParams[1] || environment.prometheusPort;
        this.addNodesToPrometheusTargets(prometheusAddress, prometheusPort, mongooseRunNodesList);
      }
    )

    // NOTE: you can get related load step ID from mongoose setup model here. 
    return this.controlApiService.runMongoose(entryNode.getResourceLocation(), this.mongooseSetupInfoModel.getConfiguration(), this.mongooseSetupInfoModel.getRunScenario()).pipe(
      map(runId => {
        this.mongooseSetupInfoModel.setLoadStepId(runId);
        this.localStorageService.saveToLocalStorage(entryNode.getResourceLocation(), runId);
        return runId;
      })
    );
  }

  // MARK: - Private

  private getSlaveNodesFromConfiguration(configuration: any): string[] {
    // NOTE: Retrieving existing slave nodes.
    let mongooseConfigurationParser = new MongooseConfigurationParser(configuration);
    return mongooseConfigurationParser.getNodes();
  }


  private addNodesToPrometheusTargets(prometheusAddress: string, prometheusPort: string, mongooseRunNodes: string[]) {
    // NOTE: An initial fetch of Prometheus configuration.
    this.http.get(environment.prometheusConfigPath, { responseType: 'text' }).subscribe((configurationFileContent: Object) => {
      let prometheusConfigurationEditor: PrometheusConfigurationEditor = new PrometheusConfigurationEditor(configurationFileContent);
      let updatedConfiguration = prometheusConfigurationEditor.addTargetsToConfiguration(mongooseRunNodes);
      // NOTE: Saving prometheus configuration in .yml file. 
      let prometheusConfigFileName = `${Constants.FileNames.PROMETHEUS_CONFIGURATION}.${FileFormat.YML}`;
      this.containerServerService.saveFile(prometheusConfigFileName, updatedConfiguration as string).subscribe(response => {
        console.log(`Container server response on file save: ${JSON.stringify(response)}. Prometheus will be eventually reloaded.`);
        // NOTE: Prometheus reloads itself once configuration is udpated. 
        this.containerServerService.requestPrometheusReload(prometheusAddress, prometheusPort).subscribe(prometheusReloadResult => {
          console.log(`Prometheus reload response: ${JSON.stringify(prometheusReloadResult)}`);
        })
      })
    });

  }
}
