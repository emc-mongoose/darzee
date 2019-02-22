import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-editing-root',
  templateUrl: './control-editing-root.component.html',
  styleUrls: ['./control-editing-root.component.css']
})
export class ControlEditingRootComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  onStartButtonClicked()  {
    alert("Mongoose has started.");
  }

}
