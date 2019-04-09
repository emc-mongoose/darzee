import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MongooseSetUpService } from '../../mongoose-set-up-service/mongoose-set-up.service';
import { ControlApiService } from 'src/app/core/services/control-api/control-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css'],
  providers: []
})
export class NodesComponent implements OnInit {

  displayingIpAddresses: String[] = this.controlApiService.mongooseSlaveNodes;

  entredIpAddress = '';
  nodeConfig: any = null;
  error: HttpErrorResponse = null;

  private slaveNodesSubscription: Subscription = new Subscription(); 

  // MARK: - Lifecycle 
  constructor(
    private mongooseSetUpService: MongooseSetUpService,
    private controlApiService: ControlApiService
    ) { }

  ngOnInit() {
    this.displayingIpAddresses = this.mongooseSetUpService.getSlaveNodesList();
    this.slaveNodesSubscription = this.mongooseSetUpService.getSlaveNodes().subscribe(nodes => { 
      this.displayingIpAddresses = nodes;
      console.log("Observable salve nodes: " + nodes);
    })
  }

  ngOnDestroy() { 
    this.onConfirmNodesConfigurationClicked(); 
    this.slaveNodesSubscription.unsubscribe(); 
  }

  // MARK: - Public 

  public onAddIpButtonClicked(entredIpAddress: string): void {
    const regExpr = new
      RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$');
    entredIpAddress = entredIpAddress.trim();

    if (!entredIpAddress) {
      console.error("IP hasn't been set up.");
    }

    const isIpValid = regExpr.test(entredIpAddress);
    if (!isIpValid) {
      alert("IP " + entredIpAddress + " is not valid. Please, provide a valid address.");
      return;
    } 

    this.mongooseSetUpService.addNode(entredIpAddress);
  }

  public deleteIp(targetIp: String): void {
    this.mongooseSetUpService.deleteSlaveNode(targetIp);
  }

  public onConfirmNodesConfigurationClicked() {
    if (this.displayingIpAddresses.length === 0) {
      alert('Please, provide an IP.');
      return;
    }
    this.mongooseSetUpService.confirmNodeConfiguration();
  }

}
