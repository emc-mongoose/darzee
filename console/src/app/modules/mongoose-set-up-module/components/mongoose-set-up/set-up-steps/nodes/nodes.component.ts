import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { NodesSetUpTableRowComponent } from './set-up-table-row/nodes-set-up-table-row.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BasicModalComponent } from 'src/app/common/modals/basic-modal.template';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss'],
  providers: []
})
export class NodesComponent implements OnInit, OnDestroy {

  private readonly IP_DEFAULT_PORT: number = 9999;

  /**
   * @param nodesSetUpTableRowComponent references Nodes table handler class. It's used to ...
   * ... select and unselect nodes manually from the code.
   */
  @ViewChild('nodesTableRow') nodesSetUpTableRowComponent: NodesSetUpTableRowComponent;

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
    private localStorageService: LocalStorageService,
    private modalService: NgbModal
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
   */
  public onAddIpButtonClicked(): void {
    const modalRef = this.modalService.open(BasicModalComponent);
    modalRef.componentInstance.name = 'World';
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
      // TODO: Spawn disappearing alert here. 
      alert(`Requested Mongoose run node won't be saved. Details: ${error}`);
      return;
    }

    // NOTE: Selecting recently added Mongoose run node.
    this.nodesSetUpTableRowComponent.onRunNodeSelect(newMongooseNode);
  }

  public onAlertClosed(closedAlert: NodeAlert) {
    let closedAlertIndex = this.getAlertIndex(closedAlert);
    this.nodeAlerts.splice(closedAlertIndex, 1);
  }


  /**
 * Displays alert on top of the screen notifying that inactive node is selected.
 * @param selectedNodeInfo instance of node that causes alert to appear.
 * @param message misleading message of the alert.
 */
  public displayNodeAlert(selectedNodeInfo: MongooseRunNode, message: string, alertType: NodeSetUpAlertType): void {

    let newAlert: NodeAlert = new NodeAlert(message, selectedNodeInfo, alertType);
    // NOTE: Finding alert by message in alerts array
    let alertIndex = this.getAlertIndex(newAlert);
    let isAlertExist: boolean = (alertIndex >= 0);

    if (!isAlertExist) {
      this.nodeAlerts.push(newAlert);
    }
    return;
  }

  /**
   * Display inactive node alert. The function is designed to ...
   * ... simlify its calling from the HTML.
   * @param selectedNodeInfo inactive node.
   */
  public displayInactiveNodeAlert(selectedNodeInfo: MongooseRunNode) {
    const errorAlertMisleadingMsg: string = `selected node ${selectedNodeInfo.getResourceLocation()} is not active`;
    this.displayNodeAlert(selectedNodeInfo, errorAlertMisleadingMsg, NodeSetUpAlertType.ERROR);
  }

  /**
   * Display alert for nodes that are not supported, thus its unable to ...
   * ... work with them via the UI.
   * @param unsupportedNodeDetails An object that contain node instance and a warning message.
   */
  public displayUnsupportedNodeAlert(unsupportedNodeDetails: any) {
    this.displayNodeAlert(unsupportedNodeDetails.node, unsupportedNodeDetails.reason, NodeSetUpAlertType.WARNING);
  }

  // MARK: - Private

  private getAlertIndex(nodeAlert: NodeAlert): number {
    return (this.nodeAlerts.findIndex(
      (alert: NodeAlert) => {
        return (alert.message == nodeAlert.message);
      }));
  }

}
