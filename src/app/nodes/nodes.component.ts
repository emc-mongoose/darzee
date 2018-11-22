import { Component, OnInit } from '@angular/core';
import { IpAddressService } from '../ip-address.service';

import { IpAddress } from '../ipAddress';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit {

  ipAddresses: IpAddress[] = null;
  selectedIp: IpAddress = null;

  constructor(private ipAddressService: IpAddressService, private router: Router) { }

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

  onNavigateNextClicked() { 
    this.router.navigate(["/control"]);
  }

}
