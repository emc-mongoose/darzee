import { Component, OnInit } from '@angular/core';
import { IpAddressService } from '../ip-address.service';

import { IpAddress } from '../ipAddress';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  ipAddresses: IpAddress[];
  selectedIp: IpAddress;

  constructor(private ipAddressService: IpAddressService) { }

  ngOnInit() {
    this.getIpAddresses();
  }

  getIpAddresses(): void {
    this.ipAddressService.getIpAddresses()
    .subscribe(ipAddress => this.ipAddresses = ipAddress);
    // alert(this.ipAddresses[1].ip);
  }

  onChange(ip: IpAddress): void {
    this.selectedIp = ip;
    alert(ip.ip);
  }
}
