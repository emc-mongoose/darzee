import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  greetingMsg: 'Hi I am Mongoose!'
  describeMsg: 'Mongoose is a powerful storage performance testing tool'
  ipAddress: ''

  constructor() { }

  ngOnInit() {
  }

}
