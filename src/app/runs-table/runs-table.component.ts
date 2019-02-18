import { Component, OnInit, Input } from '@angular/core';
import { MongooseRunRecord } from '../core/models/run-record.model';
import { trigger, state, transition, animate, style } from '@angular/animations';


@Component({
  selector: 'app-runs-table',
  templateUrl: './runs-table.component.html',
  styleUrls: ['./runs-table.component.css'],
  
})

export class RunsTableComponent implements OnInit {

  @Input() mongooseRunRecords: MongooseRunRecord[];  
  @Input() activePane: string = 'left';

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
