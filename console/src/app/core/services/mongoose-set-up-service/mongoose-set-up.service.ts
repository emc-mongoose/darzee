import { Injectable } from '@angular/core';
import { MongooseSetupInfoModel } from './mongoose-set-up-info.model';
import { ControlApiService } from 'src/app/core/services/control-api/control-api.service';
import { Constants } from 'src/app/common/constants';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PrometheusConfigurationEditor } from 'src/app/common/FileOperations/PrometheusConfigurationEditor';
import { FileFormat } from 'src/app/common/FileOperations/FileFormat';
import { ContainerServerService } from 'src/app/core/services/container-server/container-server-service';
import { map, timeout, catchError } from 'rxjs/operators';
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

  /**
   * @param DEFAULT_DATA_SCRAPE_INTERVAL_SECS period of data scraping.
   * @param DEFAULT_DATA_SCRAPE_TIMEOUT_SECS timeout for data scraping.
   * ...  WARNING: Timeout should be less or eequal than scrape interval.
   */
  private readonly DEFAULT_DATA_SCRAPE_INTERVAL_SECS: number = 8;
  private readonly DEFAULT_DATA_SCRAPE_TIMEOUT_SECS: number = 7;

  private mongooseSetupInfoModel: MongooseSetupInfoModel;

  constructor(private controlApiService: ControlApiService,
    private monitoringApiService: MonitoringApiService,
    private containerServerService: ContainerServerService,
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private prometheusApiService: PrometheusApiService) {

    this.mongooseSetupInfoModel = new MongooseSetupInfoModel();
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
    const timeoutMilliseconds: number = 2500; // NOTE: Timeout is set to 2.5 seconds 
    return this.monitoringApiService.isMongooseRunNodeActive(mongooseNodeAddress).pipe(
      timeout(timeoutMilliseconds)
    ).pipe(
      catchError(error => { 
        console.log(`Mongoose's node ${mongooseNodeAddress} status request has timed out.`);
        return of(false);
      })
    )
  }

  public getMongooseRunNodeInstance(mongooseNodeAddress: string): Observable<MongooseRunNode> { 
    const timeoutMilliseconds: number = 2500; // NOTE: Timeout is set to 2.5 seconds 
    return this.monitoringApiService.getBasicMongooseRunNodeInfo(mongooseNodeAddress).pipe(
      timeout(timeoutMilliseconds)
    ).pipe(
      // catchError(error => { 
      //   console.log(`Mongoose's node ${mongooseNodeAddress} status request has timed out.`);
      //   return of(false);
      // })
    );
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


  /**
   * Appends Prometheus' configuration with new targets.
   * @param prometheusAddress address of Prometheus' host, IPv4.
   * @param prometheusPort Prometheus'-deployment port. 
   * @param mongooseRunNodes Nodes that should be added to "targets" list.
   */
  private addNodesToPrometheusTargets(prometheusAddress: string, prometheusPort: string, mongooseRunNodes: string[]) {
    // NOTE: An initial fetch of Prometheus configuration.
    this.http.get(environment.prometheusConfigPath, { responseType: 'text' }).subscribe((configurationFileContent: Object) => {
      console.log(`Provided configuration: ${configurationFileContent}`);

      let prometheusConfigurationEditor: PrometheusConfigurationEditor = new PrometheusConfigurationEditor(configurationFileContent);

      // NOTE: Appending configuration with added Mongoose nodes.
      var updatedConfiguration = prometheusConfigurationEditor.addTargetsToConfiguration(mongooseRunNodes);

      // NOTE: changing scrape interval in order to provide better response for elements that are dependent ...
      // ... on the metrics.
      updatedConfiguration = prometheusConfigurationEditor.changeScrapeInterval(updatedConfiguration, this.DEFAULT_DATA_SCRAPE_INTERVAL_SECS);

      // NOTE: Changing scrape timeout within Prometheus configuration in order to exclude connection-related errors.
      updatedConfiguration = prometheusConfigurationEditor.changeScrapeTimeout(updatedConfiguration, this.DEFAULT_DATA_SCRAPE_TIMEOUT_SECS);

      console.log(`\n ######## Updated configuration: ${updatedConfiguration}`);

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
