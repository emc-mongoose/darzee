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

@Injectable({
  providedIn: 'root'
})
export class MongooseSetUpService {

  private mongooseSetupInfoModel: MongooseSetupInfoModel;

  constructor(private controlApiService: ControlApiService,
    private containerServerService: ContainerServerService,
    private http: HttpClient,
    private localStorageService: LocalStorageService) {

    this.mongooseSetupInfoModel = new MongooseSetupInfoModel();
    this.controlApiService.getMongooseConfiguration(this.controlApiService.getMongooseIp())
      .subscribe((configuration: any) => {
        this.mongooseSetupInfoModel.setConfiguration(configuration);
        this.mongooseSetupInfoModel.setRunNodes(this.getSlaveNodesFromConfiguration(configuration));
      });
  }

  // MARK: - Getters & Setters 

  public getMongooseConfigurationForSetUp(entryNode: MongooseRunNode): Observable<any> {
    let mongooseTargetAddress = `${Constants.Http.HTTP_PREFIX}${entryNode.getResourceLocation()}`;
    return this.controlApiService.getMongooseConfiguration(mongooseTargetAddress).pipe(
      map(
        (configuration: any) => {
          let mongooseConfigrationParser: MongooseConfigurationParser = new MongooseConfigurationParser(configuration);
          try {
            let additionalNodes = this.mongooseSetupInfoModel.getSlaveNodesList(entryNode);
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

  // NOTE: Adding Mongoose nodes (while node selection)
  public addNode(node: MongooseRunNode) {
    console.log(`node ${node.getResourceLocation()} will be eventually added.`)
    this.mongooseSetupInfoModel.addRunNode(node);
  }

  public removeNode(node: MongooseRunNode) {
    this.mongooseSetupInfoModel.removeRunNode(node);
  }


  public runMongoose(entryNode: MongooseRunNode): Observable<String> {

    // NOTE: Updating Prometheus configuration with respect to Mongoose Run nodes. 
    let mongooseRunNodesList: string[] = this.mongooseSetupInfoModel.getStringifiedNodesForDistributedMode();
    this.addNodesToPrometheusTargets(mongooseRunNodesList);

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


  private addNodesToPrometheusTargets(mongooseRunNodes: string[]) {
    // NOTE: An initial fetch of Prometheus configuration.
    this.http.get(environment.prometheusConfigPath, { responseType: 'text' }).subscribe((configurationFileContent: Object) => {
      let prometheusConfigurationEditor: PrometheusConfigurationEditor = new PrometheusConfigurationEditor(configurationFileContent);
      let updatedConfiguration = prometheusConfigurationEditor.addTargetsToConfiguration(mongooseRunNodes);
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
