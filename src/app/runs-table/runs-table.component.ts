import { Component, OnInit, Input } from '@angular/core';
import { MonitoringApiService } from '../core/services/monitoring-api/monitoring-api.service';
import { MongooseRunRecord } from '../core/models/run-record.model';

@Component({
  selector: 'app-runs-table',
  templateUrl: './runs-table.component.html',
  styleUrls: ['./runs-table.component.css']
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

  // mongooseRunRecords: MongooseRunRecord[];

  constructor(private monitoringApiService: MonitoringApiService) { }

  ngOnInit() {
    // this.mongooseRunRecords = this.monitoringApiService.getMongooseRunRecords();
  }

}
