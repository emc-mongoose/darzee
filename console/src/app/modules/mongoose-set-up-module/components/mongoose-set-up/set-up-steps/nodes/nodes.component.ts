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

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css'],
  providers: []
})
export class NodesComponent implements OnInit {

  public savedMongooseNodes$: Observable<MongooseRunNode[]> = new Observable<MongooseRunNode[]>();
  public inactiveNodeAlerts: InactiveNodeAlert[] = []; 

  displayingIpAddresses: String[] = this.controlApiService.mongooseSlaveNodes;

  entredIpAddress = '';
  nodeConfig: any = null;
  error: HttpErrorResponse = null;

  private slaveNodesSubscription: Subscription = new Subscription();

  // MARK: - Lifecycle 
  constructor(
    private mongooseSetUpService: MongooseSetUpService,
    private controlApiService: ControlApiService,
    private mongooseDataSharedService: MongooseDataSharedServiceService
  ) {
    this.savedMongooseNodes$ = this.mongooseDataSharedService.getAvailableRunNodes();
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.slaveNodesSubscription.unsubscribe();
  }

  // MARK: - Public 

  public onAddIpButtonClicked(entredIpAddress: string): void {
    let newMongooseNode = new MongooseRunNode(this.entredIpAddress);
    try {
      this.mongooseDataSharedService.addMongooseRunNode(newMongooseNode);
    } catch (error) {
      console.log(`Requested Mongoose run node won't be saved. Details: ${error}`);
      alert(`Requested Mongoose run node won't be saved. Details: ${error}`);
      return;
    }
  }

  public onRunNodeSelect(selectedNode: MongooseRunNode) {
    let isNodeLocatedByIp: boolean = (selectedNode.getResourceType() == ResourceLocatorType.IP);

    // NOTE: Add noode if check mark has been set, remove if unset    
    let hasNodeBeenSelected: boolean = this.mongooseSetUpService.isNodeExist(selectedNode);

    if (!hasNodeBeenSelected && isNodeLocatedByIp) {
      let selectedNodeResourceLocationIp: string = selectedNode.getResourceLocation();
      this.slaveNodesSubscription.add(
        this.mongooseSetUpService.isMongooseNodeActive(selectedNodeResourceLocationIp).subscribe(
          (isNodeActive: boolean) => {
            if (!isNodeActive) {
              // NOTE: Display error if Mongoose node is not activy. Don't added it to ...
              // ... the configuration thought. 
              let inactiveNodeAlert = new InactiveNodeAlert(`selected node ${selectedNode.getResourceLocation()} is not active`, selectedNode);
              // alert();
              this.inactiveNodeAlerts.push(inactiveNodeAlert);
              return;
            }
            this.mongooseSetUpService.addNode(selectedNode);
          }
        )
      )
    }

  }

  private isipValid(entredIpAddress: string) {
    console.log(`Enterd IP Address: ${this.entredIpAddress}`)
    const regExpr = new
      RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$');
    entredIpAddress = entredIpAddress.trim();

    if (!entredIpAddress) {
      console.error("IP hasn't been set up.");
    }

    const isIpValid = regExpr.test(entredIpAddress);
    return isIpValid;
  }
}
