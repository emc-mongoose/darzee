import { Component, OnInit } from '@angular/core';
import { IpAddressService } from '../ip-address.service';
import { map } from 'rxjs/operators';

import { IpAddress } from '../ipAddress';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css'],
  providers: [IpAddressService]
})
export class NodesComponent implements OnInit {

  ipAddresses: IpAddress[] = null;
  ip: string = "";
  config : any = null;

  constructor(private ipAddressService: IpAddressService, private router: Router) { }

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
      alert('Invalid IP: ' + ip + '\nPlease enter valid IP.');
    }
  }

  deleteIp(ipAddr: IpAddress): void {
    this.ipAddressService.deleteIp(ipAddr.ip);
  }

  onNavigateNextClicked() { 
        this.ipAddressService.getConfig()
      .pipe(
        map(data => console.log(data)))
      .subscribe(data => { 
        this.config = data;
        console.log(data);
      });
    // this.router.navigate(["/control"]);
  }

}
