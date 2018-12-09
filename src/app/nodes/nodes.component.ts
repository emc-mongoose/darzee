import { Component, OnInit } from '@angular/core';
import { IpAddressService } from '../ip-address.service';
import { map, subscribeOn } from 'rxjs/operators';

import { NodeConfig } from '../nodeConfig';
import { IpAddress } from '../ipAddress';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

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

  constructor(private ipAddressService: IpAddressService, private router: Router) { }

  ngOnInit() {
    this.ipAddresses = this.ipAddressService.getIpAddresses();
  }

  addIp(ip: string): void {
    const regExpr = new
      RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$');
    ip = ip.trim();

    if (!ip) {
      console.log('ip null');
    }

    if (regExpr.test(ip)) {
      this.ipAddressService.saveIpAddress(ip);
    } else {
      alert('Invalid IP: ' + ip + '\nPlease enter valid IP.');
    }
  }

  deleteIp(ipAddr: IpAddress): void {
    this.ipAddressService.deleteIp(ipAddr.ip);
  }

  onNavigateNextClicked() {
    if (this.ipAddressService.ipAddresses.length === 0) {
      alert('no IP entered!');
      return;
    }
    console.log(this.ipAddresses[0].ip);
    this.ipAddressService.entryNode = this.ipAddressService.ipAddresses[0].ip;

    this.ipAddressService.getConfig(this.ipAddressService.ipAddresses[0].ip)
      .subscribe(
        data => {
          console.log(data);
          this.updateConfiguration(data); },
        error => this.error = error
      );
  }

  private updateConfiguration(data: any) {
    console.log(data.output);
    this.nodeConfig = data;
    this.ipAddressService.nodeConfig = new NodeConfig(this.ipAddressService.ipAddresses[0].ip, this.nodeConfig);
    if (this.nodeConfig == null) {
      alert('Can not get config! Remove first IP and if neccessary add another one.');
    } else {
      console.log('OK');
      this.router.navigate(['/control']);
    }
  }

}
