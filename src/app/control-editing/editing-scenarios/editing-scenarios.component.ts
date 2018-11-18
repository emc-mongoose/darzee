import { Component, OnInit } from '@angular/core';
import { IpAddressService } from 'src/app/ip-address.service';

@Component({
  selector: 'app-editing-scenarios',
  templateUrl: './editing-scenarios.component.html',
  styleUrls: ['./editing-scenarios.component.css']
})
export class EditingScenariosComponent implements OnInit {

  public fileContent: string | ArrayBuffer;
  constructor(private service: IpAddressService) { 
    this.fileContent = service.fileContent;
  }

  ngOnInit() {
  }

}
