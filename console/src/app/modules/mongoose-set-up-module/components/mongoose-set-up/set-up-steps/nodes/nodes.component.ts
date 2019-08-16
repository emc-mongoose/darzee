import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ControlApiService } from 'src/app/core/services/control-api/control-api.service';
import { Subscription, Observable } from 'rxjs';
import { MongooseRunNode } from 'src/app/core/models/mongoose-run-node.model';
import { MongooseDataSharedServiceService } from 'src/app/core/services/mongoose-data-shared-service/mongoose-data-shared-service.service';
import { LocalStorageService } from 'src/app/core/services/local-storage-service/local-storage.service';
import { map } from 'rxjs/operators';
import { HttpUtils } from 'src/app/common/HttpUtils';
import { NodeAlert } from './node-alert.interface';
import { NodeSetUpAlertType } from './node-setup-alert.type';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss'],
  providers: []
})
export class NodesComponent implements OnInit, OnDestroy {

  private readonly IP_DEFAULT_PORT: number = 9999;

  public runNode: MongooseRunNode;

  public savedMongooseNodes$: Observable<MongooseRunNode[]> = new Observable<MongooseRunNode[]>();
  public nodeAlerts: NodeAlert[] = [];
  public displayingIpAddresses: String[] = this.controlApiService.mongooseSlaveNodes;
  public entredIpAddress = '';
  public nodeConfig: any = null;
  public error: HttpErrorResponse = null;

  private slaveNodesSubscription: Subscription = new Subscription();

  // MARK: - Lifecycle 
  constructor(
    private controlApiService: ControlApiService,
    private mongooseDataSharedService: MongooseDataSharedServiceService,
    private localStorageService: LocalStorageService
  ) {
    this.savedMongooseNodes$ = this.mongooseDataSharedService.getAvailableRunNodes().pipe(
      map((nodes: MongooseRunNode[]) => {
        const hiddenNodes: string[] = this.localStorageService.getHiddenNodeAddresses();
        nodes.forEach((node: MongooseRunNode) => {
          if (hiddenNodes.includes(node.getResourceLocation())) {
            this.mongooseDataSharedService.deleteMongooseRunNode(node);
          }
        })
        return nodes;
      })
    );
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.slaveNodesSubscription.unsubscribe();
  }

  // MARK: - Public 

  /**
   * Handling node addition from the UI.
   * @param entredIpAddress entered IP from the UI.
   */
  public onAddIpButtonClicked(): void {
    // NOTE: trimming accident whitespaces
    const allWhitespacesRegex: RegExp = /\s/g;
    this.entredIpAddress = this.entredIpAddress.replace(allWhitespacesRegex, "");
    console.log(`[${NodesComponent.name}] Processing entered IPv4 address: "${this.entredIpAddress}"`);

    const savingNodeAddress: string = this.entredIpAddress;

    if (!HttpUtils.isIpAddressValid(savingNodeAddress)) {
      if (HttpUtils.matchesIpv4AddressWithoutPort(savingNodeAddress)) {
        this.entredIpAddress = HttpUtils.addPortToIp(this.entredIpAddress, this.IP_DEFAULT_PORT);
      } else {
        alert(`IP address ${this.entredIpAddress} is not valid. Please, provide a valid one.`);
        return;
      }
    }

    const processedMongooseNodeAddress: string = HttpUtils.pruneHttpPrefixFromAddress(this.entredIpAddress);

    let newMongooseNode = new MongooseRunNode(processedMongooseNodeAddress);

    const isNodeSupported: boolean = this.isNodeSupported(newMongooseNode);
    if (!isNodeSupported) {
      // NOTE: Displaying warning if user tries to work with a localhost node.
      const misleadingMsg: string = "Communication with localhost is supported only in development mode.";
      this.displayNodeAlert(newMongooseNode, misleadingMsg);
    }

    try {
      const savingNodeAddress: string = newMongooseNode.getResourceLocation();

      const hiddenNodes: string[] = this.localStorageService.getHiddenNodeAddresses();
      const isNodeHidden: boolean = hiddenNodes.includes(savingNodeAddress);
      if (isNodeHidden) {
        const shouldHideNode: boolean = false;
        this.localStorageService.changeNodeAddressHidingStatus(savingNodeAddress, shouldHideNode);
      } else {
        this.localStorageService.saveMongooseRunNode(savingNodeAddress);
      }
      this.mongooseDataSharedService.addMongooseRunNode(newMongooseNode, isNodeHidden);

      const emptyValue: string = "";
      this.entredIpAddress = emptyValue;
    } catch (error) {
      console.log(`Requested Mongoose run node won't be saved. Details: ${error}`);
      alert(`Requested Mongoose run node won't be saved. Details: ${error}`);
      return;
    }
  }

  public onAlertClosed(closedAlert: NodeAlert) {
    let closedAlertIndex = this.getAlertIndex(closedAlert);
    this.nodeAlerts.splice(closedAlertIndex, 1);
  }


  /**
 * Displays alert on top of the screen notifying that inactive node is selected.
 * @param selectedNodeInfo instance of node that causes alert to appear.
 * @param type type of appearing alert. Error by default.
 * @param message misleading message of the alert.
 */
  public displayNodeAlert(selectedNodeInfo: MongooseRunNode, message: string = "") {
    const causedNodeResourceLocation: string = selectedNodeInfo.getResourceLocation();
    var misleadingMsg: string = "";
    // NOTE: Alert type is "Error" by default.
    var alertType: NodeSetUpAlertType = NodeSetUpAlertType.ERROR;

    var newAlerts: NodeAlert[] = [];

    const hasLocalhostKeyword: boolean = causedNodeResourceLocation.includes(HttpUtils.LOCALHOST_KEYWORD);
    if (hasLocalhostKeyword) {
      // NOTE: Warning alerts are additional ones. You can push warning alerts along with ...
      // ... error alerts.
      alertType = NodeSetUpAlertType.WARNING;
      const localhostNotSupportedMsg: string = "Communication with localhost is supported only in development mode.";
      misleadingMsg = localhostNotSupportedMsg;
      let warningNodeAlert: NodeAlert = new NodeAlert(misleadingMsg, selectedNodeInfo, alertType);
      newAlerts.push(warningNodeAlert);
    }

    let errorAlert = new NodeAlert(misleadingMsg, selectedNodeInfo, alertType);
    newAlerts.push(errorAlert);

    for (var newAlert of newAlerts) {
      // NOTE: Finding alert by message in alerts array
      let alertIndex = this.getAlertIndex(newAlert);
      let isAlertExist: boolean = (alertIndex >= 0);

      if (!isAlertExist) {
        this.nodeAlerts.push(newAlert);
      }
    }

    return;
  }

  // MARK: - Private

  private getAlertIndex(nodeAlert: NodeAlert): number {
    return (this.nodeAlerts.findIndex(
      (alert: NodeAlert) => {
        return (alert.message == nodeAlert.message);
      }));
  }

  /**
   * Determines if communication with @param node is supported from the UI.
   * @param node processing Mongoose node. 
   */
  private isNodeSupported(node: MongooseRunNode): boolean {
    const processingNodeAddress: string = node.getResourceLocation();
    const hasLocalhostKeyword: boolean = processingNodeAddress.includes(HttpUtils.LOCALHOST_KEYWORD);
    const isNodeSupported: boolean = (!hasLocalhostKeyword);
    return isNodeSupported;
  }

}
