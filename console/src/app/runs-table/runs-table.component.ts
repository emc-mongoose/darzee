import { Component, OnInit, Input } from '@angular/core';
import { MongooseRunRecord } from '../core/models/run-record.model';
import { Router } from '@angular/router';
import { RoutesList } from '../Routing/routes-list';
import { MonitoringApiService } from '../core/services/monitoring-api/monitoring-api.service';
import { timer, Observable } from 'rxjs';

@Component({
  selector: 'app-runs-table',
  templateUrl: './runs-table.component.html',
  styleUrls: ['./runs-table.component.css']
})

export class RunsTableComponent implements OnInit {

  @Input("mongooseRunRecords") mongooseRunRecordsObservable: Observable<MongooseRunRecord[]>;
  public mongooseRunRecords: MongooseRunRecord[] = []; 

  readonly EMPTY_FIELD_DEFAULT_TAG = "-";

  readonly columnHeaders = [
    "Status",
    "Start time",
    "Nodes",
    "Duration",
    "Comment"
  ];

  constructor(private router: Router,
    private monitoringApiService: MonitoringApiService) { }

  // MARK: - Lifecycle 

  ngOnInit() {
    this.mongooseRunRecordsObservable.subscribe(runRecords => { 
      this.mongooseRunRecords = runRecords;
    })
    this.setUpRecordsUpdateTimer();
  }

  // MARK: - Public 

  public onRunStatusIconClicked(mongooseRunRecord: MongooseRunRecord) {
    this.router.navigate(['/' + RoutesList.RUN_STATISTICS, mongooseRunRecord.getIdentifier()]);
  }

  // NOTE: Updating run duration for the target run record 
  private updateRecord(targetRecord: MongooseRunRecord) {
    this.monitoringApiService.updateRecord(targetRecord).subscribe(updatedRecord => {
      if (updatedRecord == undefined) {
        return;
      }
      targetRecord.setDuration(updatedRecord.getDuration());
      // targetRecord.status = updatedRecord.getStatus();
    });
  }

  // NOTE: Updating dynamic Mongoose run parameters (run status, run duration).
  private setUpRecordsUpdateTimer() {
    let initialRunTableUpdateDelay = 0;
    let singleRecordStatisticsUpdatePeriod = 3000;
    timer(initialRunTableUpdateDelay, singleRecordStatisticsUpdatePeriod).subscribe(value => {
      this.mongooseRunRecords.forEach(runRecord => {
        this.updateRecord(runRecord);
      })
    });
  }

}
