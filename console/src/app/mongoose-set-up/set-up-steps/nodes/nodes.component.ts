import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ControlApiService } from 'src/app/core/services/control-api/control-api.service';
import { Subscription, Observable } from 'rxjs';
import { MongooseSetUpService } from 'src/app/core/services/mongoose-set-up-service/mongoose-set-up.service';
import { MongooseRunNode } from 'src/app/core/models/mongoose-run-node.model';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css'],
  providers: []
})
export class NodesComponent implements OnInit {

  public savedMongooseNodes: Observable<MongooseRunNode[]> = new Observable<MongooseRunNode[]>(); 

  displayingIpAddresses: String[] = this.controlApiService.mongooseSlaveNodes;

  entredIpAddress = '';
  nodeConfig: any = null;
  error: HttpErrorResponse = null;

  private slaveNodesSubscription: Subscription = new Subscription(); 

  // MARK: - Lifecycle 
  constructor(
    private mongooseSetUpService: MongooseSetUpService,
    private controlApiService: ControlApiService
    ) { 
      this.savedMongooseNodes = this.mongooseSetUpService.getSavedMongooseNodes();
      this.savedMongooseNodes.subscribe(
        savedNode => { 
          console.log(`Saved node: ${JSON.stringify(savedNode)}`);
        }
      )
    }

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
    let savedNode = new MongooseRunNode(this.entredIpAddress);
    try { 
      this.mongooseSetUpService.saveMongooseNodes(savedNode);
    } catch (error) { 
      console.log(`Requested Mongoose run node won't be saved. Details: ${JSON.stringify(error)}`);
      alert(`Node won't be saved.`);
    }


    console.log(`Enterd IP Address: ${this.entredIpAddress}`)
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
