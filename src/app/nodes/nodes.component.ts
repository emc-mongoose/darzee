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
   
    console.log('Added IP is: ' + ip);
    if (!ip) {
      console.log('ip null');
    }
    this.ipAddressService.saveIpAddress(ip);
  }

  deleteIp(ipAddr: IpAddress): void {
    // console.log('ip for delete:' + ipAddr.ip);
    this.ipAddressService.deleteIp(ipAddr.ip);
  }

}
