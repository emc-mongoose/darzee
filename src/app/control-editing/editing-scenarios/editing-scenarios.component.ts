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

  data = {
    'best_student': 'Andrey Koltsov',
    'self_esteem, %': 99999,
    'best_in': ['coding', 3333, 'managing'],
    'purpose in life': undefined,
    'bad_sides': null,
    'positive sides': {
      'smart': 'level nine plus',
      'GPA': 1234567,
      'companies wants to hire him': ['Google', 22222, 'Tesla'],
      'companies he wants to work in': {
        'company1': 'DELL',
        'company2': 'EMC',
        'company3': 'MONGOOSE'
      }
    }
  };

  ngOnInit() {
  }

}
