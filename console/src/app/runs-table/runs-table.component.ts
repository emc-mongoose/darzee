import { Component, OnInit, Input } from '@angular/core';
import { MongooseRunRecord } from '../core/models/run-record.model';
import { Router } from '@angular/router';
import { RoutesList } from '../Routing/routes-list';
import { MonitoringApiService } from '../core/services/monitoring-api/monitoring-api.service';
import { timer } from 'rxjs';


@Component({
  selector: 'app-runs-table',
  templateUrl: './runs-table.component.html',
  styleUrls: ['./runs-table.component.css'],
  
})

export class RunsTableComponent implements OnInit {

  readonly EMPTY_FIELD_DEFAULT_TAG = "-";

  @Input() mongooseRunRecords: MongooseRunRecord[];  

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
    this.setUpDurationUpdateTimer();
  }

  // MARK: - Public 

  onRunStatusIconClicked(mongooseRunRecord: MongooseRunRecord) { 
    this.router.navigate(['/' + RoutesList.RUN_STATISTICS, mongooseRunRecord.getIdentifier()]);
  }


  // NOTE: Updating run duration for the target run record 
  private updateDuration(targetRecord: MongooseRunRecord) { 
    this.monitoringApiService.getDuration(targetRecord).subscribe(updatedDuration => { 
      console.log("updatedDuration: ", updatedDuration);
      targetRecord.setDuration(updatedDuration);
    }); 
  }

  private setUpDurationUpdateTimer() { 
    let initialRunTableUpdateDelay = 0; 
    let runTableUpdatePeriod = 3000; 
    timer(initialRunTableUpdateDelay, runTableUpdatePeriod).subscribe(value => { 
      this.mongooseRunRecords.forEach(runRecord => { 
        this.updateDuration(runRecord);
        console.log("Duration has been updated.");
      })
  });
}

}
