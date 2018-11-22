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
   
    if (!ip) {
      console.log('ip null');
    }
    this.ipAddressService.saveIpAddress(ip);
    console.log(ip);
  }

  deleteIp(ipAddr: IpAddress): void {
    this.ipAddressService.deleteIp(ipAddr.ip);
  }

  onNavigateNextClicked() { 
    console.log(this.ipAddresses[0].ip);
    this.ipAddresses.forEach(element => {
      console.log(element.ip);
      this.ipAddressService.getConfig(element.ip)
      .pipe(
        map(data => console.log(data)))
      .subscribe(
        // data => { 
        // this.config = data;
        // console.log(data);
      // }
      );
    });
    // this.ipAddressService.getConfig()
    //   .pipe(
    //     map(data => console.log(data)))
    //   .subscribe(data => { 
    //     this.config = data;
    //     console.log(data);
    //   });

    // this.router.navigate(["/control"]);
  }

}
