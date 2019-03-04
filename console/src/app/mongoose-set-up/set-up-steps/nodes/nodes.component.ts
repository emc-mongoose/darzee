import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IpAddressService } from 'src/app/core/services/ip-addresses/ip-address.service';
import { IpAddress } from 'src/app/core/services/ip-addresses/ipAddress';
import { NodeConfig } from 'src/app/core/services/ip-addresses/nodeConfig';
import { MongooseSetUpService } from '../../mongoose-set-up-service/mongoose-set-up.service';
import { ControlApiService } from 'src/app/core/services/control-api/control-api.service';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css'],
  providers: [IpAddressService]
})
export class NodesComponent implements OnInit {

  ipAddresses: IpAddress[] = null;
  displayingIpAddresses: String[] = this.controlApiService.mongooseSlaveNodes;
  ip = '';

  nodeConfig: any = null;
  error: HttpErrorResponse = null;

  constructor(
    private mongooseSetUpService: MongooseSetUpService,
    private controlApiService: ControlApiService
    ) { }

  ngOnInit() {
    this.displayingIpAddresses = this.mongooseSetUpService.getSlaveNodesList();
    this.mongooseSetUpService.getObservableSlaveNodes().subscribe(nodes => { 
      this.displayingIpAddresses = nodes;
      console.log("Observable salve nodes: " + nodes);
    })
  }

  onAddIpButtonClicked(ip: string): void {
    const regExpr = new
      RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$');
    ip = ip.trim();

    if (!ip) {
      console.log("IP hasn't been set up.");
    }

    const isIpValid = regExpr.test(ip);
    if (!isIpValid) {
      alert("IP " + ip + " is not valid. Please, provide a valid address.");
      return;
    } 

    this.mongooseSetUpService.addNode(ip);
  }

  deleteIp(targetIp: String): void {
    this.mongooseSetUpService.deleteSlaveNode(targetIp);
    // this.ipAddressService.deleteIp(id);
  }

  onConfirmNodesConfigurationClicked() {
    if (this.displayingIpAddresses.length === 0) {
      alert('Please, provide an IP.');
      return;
    }
    this.mongooseSetUpService.confirmNodeConfiguration();
  }

}
