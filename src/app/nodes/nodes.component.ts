import { Component, OnInit } from '@angular/core';
import { IpAddressService } from '../ip-address.service';

import { IpAddress } from '../ipAddress';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css'],
  providers: [IpAddressService]
})
export class NodesComponent implements OnInit {

  ipAddresses: IpAddress[] = null;
  ip: string = "";

  constructor(private ipAddressService: IpAddressService) { }

  ngOnInit() {
    this.ipAddresses = this.ipAddressService.getIpAddresses();
  }

  addIp(ip: string): void {
    
    const regExpr = new 
      RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
    ip = ip.trim();
    
    if (!ip) {
      console.log('ip null');
    }

    if (regExpr.test(ip)) {
      this.ipAddressService.saveIpAddress(ip);
    } else {
      alert('Invalid IP!  ' + ip);
    }
  }

  deleteIp(ipAddr: IpAddress): void {
    this.ipAddressService.deleteIp(ipAddr.ip);
  }



}
