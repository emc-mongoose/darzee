import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-runs-table',
  templateUrl: './runs-table.component.html',
  styleUrls: ['./runs-table.component.css']
})
export class RunsTableComponent implements OnInit {

  readonly columnHeaders = [
    "Status",
    "Start time",
    "Nodes",
    "Duration",
    "Comment"
  ];

  constructor() { }

  ngOnInit() {
  }

}
