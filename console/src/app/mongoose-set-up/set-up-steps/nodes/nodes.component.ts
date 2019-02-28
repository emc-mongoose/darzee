import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IpAddressService } from 'src/app/core/services/ip-addresses/ip-address.service';
import { IpAddress } from 'src/app/core/services/ip-addresses/ipAddress';
import { NodeConfig } from 'src/app/core/services/ip-addresses/nodeConfig';
import { MongooseSetUpService } from '../../mongoose-set-up-service/mongoose-set-up.service';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css'],
  providers: [IpAddressService]
})
export class NodesComponent implements OnInit {

  ipAddresses: IpAddress[] = null;
  ip = '';

  nodeConfig: any = null;
  error: HttpErrorResponse = null;

  constructor(private ipAddressService: IpAddressService, 
    private mongooseSetUpService: MongooseSetUpService) { }

  ngOnInit() {
    this.ipAddresses = this.ipAddressService.getIpAddresses();
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

  deleteIp(id: number): void {
    this.ipAddressService.deleteIp(id);
  }

  onConfirmNodesConfigurationClicked() {
    if (this.ipAddressService.ipAddresses.length === 0) {
      alert('Please, provide an IP.');
      return;
    }
    console.log("this.ipAddresses[0].ip): ", this.ipAddresses[0].ip);
    this.ipAddressService.entryNode = this.ipAddressService.ipAddresses[0].ip;

    this.ipAddressService.getConfig(this.ipAddressService.ipAddresses[0].ip)
      .subscribe(
        data => {
          // NOTE: Loading Mongoose configuration in debug purposes
          this.updateConfiguration(data);
         },
        error => this.error = error
      );
  }

  private updateConfiguration(data: string) {

    console.log("Configuration has been updated.");
    // console.log(data.output);
    // this.nodeConfig = data;
    // console.log("Node configuration data: " + JSON.stringify(data));
    // this.ipAddressService.nodeConfig = new NodeConfig(this.ipAddressService.ipAddresses[0].ip, this.nodeConfig);
    // if (this.nodeConfig == null) {
    //   alert('Can not get config! Remove first IP and if neccessary add another one.');
    // } else {
    //   console.log('OK');
    // }
  }

}
