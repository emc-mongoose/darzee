import { Component, OnInit, Input } from '@angular/core';
import { MongooseRunRecord } from '../core/models/run-record.model';


@Component({
  selector: 'app-runs-table',
  templateUrl: './runs-table.component.html',
  styleUrls: ['./runs-table.component.css'],
  
})

export class RunsTableComponent implements OnInit {

  @Input() mongooseRunRecords: MongooseRunRecord[];  

  readonly columnHeaders = [
    "Status",
    "Start time",
    "Nodes",
    "Duration",
    "Comment"
  ];

  constructor() { }

  // MARK: - Lifecycle 

  ngOnInit() {  }

}
