import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IpAddressService } from 'src/app/core/services/ip-addresses/ip-address.service';

@Component({
  selector: 'app-control-editing-root',
  templateUrl: './control-editing-root.component.html',
  styleUrls: ['./control-editing-root.component.css']
})
export class ControlEditingRootComponent implements OnInit {

  constructor(private router: Router, private service: IpAddressService) { }

  ngOnInit() {
  }

  onNavigatePreviousClicked() { 
    this.router.navigate(["/control"]);
  }

  onStartButtonClicked()  {
    alert("Mongoose has started.");
  }

}
