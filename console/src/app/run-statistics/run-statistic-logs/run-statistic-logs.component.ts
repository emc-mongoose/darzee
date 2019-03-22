import { Component, OnInit, Input } from '@angular/core';
import { MonitoringApiService } from 'src/app/core/services/monitoring-api/monitoring-api.service';
import { BasicTab } from 'src/app/common/BasicTab/BasicTab';
import { MongooseRunRecord } from 'src/app/core/models/run-record.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParams } from 'src/app/Routing/params.routes';
import { RoutesList } from 'src/app/Routing/routes-list';

@Component({
  selector: 'app-run-statistic-logs',
  templateUrl: './run-statistic-logs.component.html',
  styleUrls: ['./run-statistic-logs.component.css']
})
export class RunStatisticLogsComponent implements OnInit {

  private processingRunRecord: MongooseRunRecord;

  private displayingLog = ' mongoose_duration_count{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 2981.0 \n mongoose_duration_sum{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 0.060955 mongoose_duration_count{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 2981.0 \n mongoose_duration_sum{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 0.060955 mongoose_duration_count{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 2981.0 \n mongoose_duration_sum{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 0.060955 mongoose_duration_count{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 2981.0 \n mongoose_duration_sum{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 0.060955';
  private logTabs: BasicTab[] = []; 
  private routeParameters: any;

 
  constructor(private monitoringApiService: MonitoringApiService,
    private router: Router, 
    private route: ActivatedRoute) { }

  // MARK: - Lifecycle

  ngOnInit() {

    // NOTE: Getting ID of the required Run Record from the HTTP query parameters. 
    this.routeParameters = this.route.parent.params.subscribe(params => {
      console.log("params: ", JSON.stringify(params));
      let targetRecordLoadStepId = params[RouteParams.ID];
      try { 
        this.processingRunRecord = this.monitoringApiService.getMongooseRunRecordById(targetRecordLoadStepId);
        this.initlogTabs();
      } catch (recordNotFoundError) { 
        // NOTE: Navigating back to 'Runs' page in case record hasn't been found. 
        alert("Unable to load requested record.");
        console.error(recordNotFoundError);
        this.router.navigate([RoutesList.RUNS]);
      }
    });
  }

  // MARK: - Public

  changeDisplayingLog(selectedTabName) { 
    let logApiEndpoint = this.monitoringApiService.getLogApiEndpoint(selectedTabName);
    this.monitoringApiService.getLog(this.processingRunRecord.getIdentifier(), logApiEndpoint).subscribe(logs => { 
      this.displayingLog = JSON.stringify(logs);
    });
  }

  // MARK: - Private

  private initlogTabs() { 
    let availableLogNames = this.monitoringApiService.getAvailableLogNames();
    for (let logName of availableLogNames) { 
      let TAB_LINK_MOCK = "/";
      let tab = new BasicTab(logName, TAB_LINK_MOCK);
      this.logTabs.push(tab);
    }
    const initialTab = this.logTabs[0];
    initialTab.isActive = true; 
  }
}
