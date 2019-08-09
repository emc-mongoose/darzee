import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ControlApiService } from 'src/app/core/services/control-api/control-api.service';
import { Subscription, Observable } from 'rxjs';
import { MongooseSetUpService } from 'src/app/core/services/mongoose-set-up-service/mongoose-set-up.service';
import { MongooseRunNode } from 'src/app/core/models/mongoose-run-node.model';
import { MongooseDataSharedServiceService } from 'src/app/core/services/mongoose-data-shared-service/mongoose-data-shared-service.service';
import { ResourceLocatorType } from 'src/app/core/models/address-type';
import { MongooseSetupStep } from 'src/app/modules/mongoose-set-up-module/interfaces/mongoose-setup-step.interface';
import { InactiveNodeAlert } from './incative-node-alert.interface';
import { LocalStorageService } from 'src/app/core/services/local-storage-service/local-storage.service';
import { map } from 'rxjs/operators';
import { elementContainerEnd } from '@angular/core/src/render3';
import { MongooseStoredRunNode } from 'src/app/core/services/local-storage-service/mongoose-stored-run-node.model';
import { HttpUtils } from 'src/app/common/HttpUtils';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss'],
  providers: []
})
export class NodesComponent implements OnInit {
  
  private readonly IP_DEFAULT_PORT: number = 9999;

  public runNode: MongooseRunNode;

  public savedMongooseNodes$: Observable<MongooseRunNode[]> = new Observable<MongooseRunNode[]>();
  public inactiveNodeAlerts: InactiveNodeAlert[] = [];
  public displayingIpAddresses: String[] = this.controlApiService.mongooseSlaveNodes;
  public entredIpAddress = '';
  public nodeConfig: any = null;
  public error: HttpErrorResponse = null;

  private slaveNodesSubscription: Subscription = new Subscription();

  // MARK: - Lifecycle 
  constructor(
    private mongooseSetUpService: MongooseSetUpService,
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
  public onAddIpButtonClicked(entredIpAddress: string): void {
    // NOTE: trimming accident whitespaces
    this.entredIpAddress = this.entredIpAddress.replace(/\s/g, "");

    const savingNodeAddress: string = this.entredIpAddress;
    if (!HttpUtils.isIpAddressValid(savingNodeAddress)) {
      if (HttpUtils.matchesIpv4AddressWithoutPort(savingNodeAddress)) {
        this.entredIpAddress = HttpUtils.addPortToIp(this.entredIpAddress, this.IP_DEFAULT_PORT);
      } else {
        alert(`IP address ${this.entredIpAddress} is not valid. Please, provide a valid one.`);
        return;
      }
    }

    let newMongooseNode = new MongooseRunNode(this.entredIpAddress);
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

  public onAlertClosed(closedAlert: InactiveNodeAlert) {
    let closedAlertIndex = this.getAlertIndex(closedAlert);
    this.inactiveNodeAlerts.splice(closedAlertIndex, 1);
  }

  private isipValid(entredIpAddress: string) {
    const regExpr = new
      RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$');
    entredIpAddress = entredIpAddress.trim();

    if (!entredIpAddress) {
      console.error("IP hasn't been set up.");
    }

    const isIpValid = regExpr.test(entredIpAddress);
    return isIpValid;
  }

  /**
 * Displays alert on top of the screen notifying that inactive node is selected.
 * @param inactiveNode inactive node instance,
 */
  private displayInactivenodeAlert(inactiveNode: MongooseRunNode) {
    // NOTE: Display error if Mongoose node is not activy. Don't added it to ...
    // ... the configuration thought. 
    let inactiveNodeAlert = new InactiveNodeAlert(`selected node ${inactiveNode.getResourceLocation()} is not active`, inactiveNode);

    // NOTE: Finding alert by message in alerts array
    let alertIndex = this.getAlertIndex(inactiveNodeAlert);
    let isAlertExist: boolean = (alertIndex >= 0);

    if (!isAlertExist) {
      this.inactiveNodeAlerts.push(inactiveNodeAlert);
    }
    return;
  }

  private getAlertIndex(inactiveNodeAlert: InactiveNodeAlert): number {
    return (this.inactiveNodeAlerts.findIndex(
      (alert: InactiveNodeAlert) => {
        return (alert.message == inactiveNodeAlert.message);
      }));
  }

}
