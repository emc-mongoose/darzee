import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MonitoringApiService } from '../core/services/monitoring-api/monitoring-api.service';
import { MongooseRunRecord } from '../core/models/run-record.model';

@Component({
  selector: 'app-run-statistics',
  templateUrl: './run-statistics.component.html',
  styleUrls: ['./run-statistics.component.css']
})
export class RunStatisticsComponent implements OnInit {

  private routeParameters: any; 
  private runRecord: MongooseRunRecord; 

  constructor(private route: ActivatedRoute,
    private monitoringApiService: MonitoringApiService) { }

  // MARK: - Lifecycle 

  ngOnInit() {
    this.routeParameters = this.route.params.subscribe(params => { 
      // TODO: Move parameter name into constants 
      let displayingRecordId = params['id'];
      this.runRecord = this.monitoringApiService.getMongooseRunRecordById(displayingRecordId);
    });
  }

  ngOnDestroy() { 
    this.routeParameters.unsubscribe();
  }

  // MARK: - Public 

}
