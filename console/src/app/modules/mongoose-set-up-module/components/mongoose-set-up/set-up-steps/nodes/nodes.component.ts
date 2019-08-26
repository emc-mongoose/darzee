import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
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
   * @param NndesSetUpTableRowComponents references to nodes table rows. It's used to ...
   * ... manually control each row. 
   */
  @ViewChildren(NodesSetUpTableRowComponent) nodesSetUpTableRowComponents: QueryList<NodesSetUpTableRowComponent>;

  public runNode: MongooseRunNode;

  public savedMongooseNodes$: Observable<MongooseRunNode[]> = new Observable<MongooseRunNode[]>();
  public nodeAlerts: NodeAlert[] = [];
  public displayingIpAddresses: String[] = this.controlApiService.mongooseSlaveNodes;
  public entredIpAddress = '';
  public nodeConfig: any = null;
  public error: HttpErrorResponse = null;

  public shouldDisplayAddButtonPopover: boolean = false;

  private slaveNodesSubscription: Subscription = new Subscription();
  private nodesTableRowsSubscription: Subscription = new Subscription();

  private recentlyAddedNode: MongooseRunNode = undefined;

  // MARK: - Lifecycle 
  constructor(
    private controlApiService: ControlApiService,
    private mongooseDataSharedService: MongooseDataSharedServiceService,
    private localStorageService: LocalStorageService
  ) {
    this.savedMongooseNodes$ = this.mongooseDataSharedService.getAvailableRunNodes().pipe(
      map((nodes: MongooseRunNode[]) => {
        const hiddenNodes: string[] = this.localStorageService.getHiddenNodeAddresses();
        console.log(`savedMongooseNodes subscription`)
        nodes.forEach((node: MongooseRunNode) => {
          if (hiddenNodes.includes(node.getResourceLocation())) {
            this.mongooseDataSharedService.deleteMongooseRunNode(node);
          }
        });

        
        if (this.recentlyAddedNode != undefined) {
          // NOTE: Set recently added node as selected.
          this.setNodeAsSelected(this.recentlyAddedNode);
        }

        return nodes;
      })
    );
  }

  ngOnInit() { 
    this.setupComponent();
  }

  ngOnDestroy() {
    this.slaveNodesSubscription.unsubscribe();
    this.nodesTableRowsSubscription.unsubscribe();
  }

  // MARK: - Public 

  /**
   * Handling node addition from the UI.
   */
  public onAddIpButtonClicked(): void {
    // NOTE: Do not display invalid IP popover by default.
    this.shouldDisplayAddButtonPopover = false;

    // NOTE: trimming accident whitespaces
    const allWhitespacesRegex: RegExp = /\s/g;
    this.entredIpAddress = this.entredIpAddress.replace(allWhitespacesRegex, "");
    console.log(`[${NodesComponent.name}] Processing entered IPv4 address: "${this.entredIpAddress}"`);

    const savingNodeAddress: string = this.entredIpAddress;

    if (!HttpUtils.isIpAddressValid(savingNodeAddress)) {
      if (HttpUtils.matchesIpv4AddressWithoutPort(savingNodeAddress)) {
        this.entredIpAddress = HttpUtils.addPortToIp(this.entredIpAddress, this.IP_DEFAULT_PORT);
      } else {
        console.error(`[${NodesComponent.name}]: Address ${savingNodeAddress} is not valid.`)
        this.shouldDisplayAddButtonPopover = true;
        const emptyString: string = "";
        this.entredIpAddress = emptyString;
        return;
      }
    }

    const processedMongooseNodeAddress: string = HttpUtils.pruneHttpPrefixFromAddress(this.entredIpAddress);

    let newMongooseNode = new MongooseRunNode(processedMongooseNodeAddress);
    this.recentlyAddedNode = newMongooseNode;

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
      console.error(`${newMongooseNode.getResourceLocation()} won't be saved. Details: ${JSON.stringify(error)}`);
      const misleadingMsg: string = `Unable to save run node ${newMongooseNode.getResourceLocation()}} due to an unknown reason.`;
      this.displayNodeAlert(newMongooseNode, misleadingMsg, NodeSetUpAlertType.ERROR);
      return;
    }

  }

  public onAlertClosed(closedAlert: NodeAlert) {
    let closedAlertIndex = this.getAlertIndex(closedAlert);
    this.nodeAlerts.splice(closedAlertIndex, 1);
  }

  public closePopover(): void {
    this.shouldDisplayAddButtonPopover = false;
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

  /**
   * Searches nodes table for a row that matches @param node instance.
   * Set matching node as selected.
   */
  private setNodeAsSelected(node: MongooseRunNode): void {
    // NOTE: Observing nodes table change. 
    // Once new element has been appended, it should be a recently added node.
    this.nodesTableRowsSubscription = this.nodesSetUpTableRowComponents.changes.subscribe(
      (updatedTestRows: NodesSetUpTableRowComponent[]) => {
        // NOTE: Searching for row that should be updated.
        // updatedTestRows.forEach(
        //   (row: NodesSetUpTableRowComponent) => { 
        //     if (row.runNode.getResourceLocation() == node.getResourceLocation()) { 
        //       row.onRunNodeSelect(node);
        //       this.nodesSetUpTableRowComponents.notifyOnChanges();
        //     }
        //   }
        // )
        const rowThatShouldBeUpdated: NodesSetUpTableRowComponent = updatedTestRows.filter(
          (row: NodesSetUpTableRowComponent) => 
          row.runNode.getResourceLocation() == node.getResourceLocation()
          )[0];

          // console.log(`rowThatShouldBeUpdated ${rowThatShouldBeUpdated.runNode.getResourceLocation()}`)
        if (rowThatShouldBeUpdated == undefined) {
          return; 
        }
        rowThatShouldBeUpdated.onRunNodeSelect(node);
        this.nodesSetUpTableRowComponents.notifyOnChanges();  
      });
  }

  /**
   * Performs set up operations for the component.
   */
  private setupComponent(): void { 
    // NOTE: Observing nodes table changes in order to ...
    // ... be able to handle recently added nodes manually.
    // this.nodesSetUpTableRowComponents.notifyOnChanges();
  }

}
