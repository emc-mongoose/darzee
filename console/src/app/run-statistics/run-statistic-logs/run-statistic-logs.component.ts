import { Component, OnInit, Input } from '@angular/core';
import { MonitoringApiService } from 'src/app/core/services/monitoring-api/monitoring-api.service';
import { BasicTab } from 'src/app/common/BasicTab/BasicTab';
import { MongooseRunRecord } from 'src/app/core/models/run-record.model';

@Component({
  selector: 'app-run-statistic-logs',
  templateUrl: './run-statistic-logs.component.html',
  styleUrls: ['./run-statistic-logs.component.css']
})
export class RunStatisticLogsComponent implements OnInit {

  @Input() processingRunRecord: MongooseRunRecord;

  private displayingLog = ' mongoose_duration_count{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 2981.0 \n mongoose_duration_sum{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 0.060955 mongoose_duration_count{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 2981.0 \n mongoose_duration_sum{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 0.060955 mongoose_duration_count{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 2981.0 \n mongoose_duration_sum{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 0.060955 mongoose_duration_count{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 2981.0 \n mongoose_duration_sum{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 0.060955';
  private logTabs: BasicTab[] = []; 
 
  constructor(private monitoringApiService: MonitoringApiService) { }

  // MARK: - Lifecycle

  ngOnInit() {
    this.initlogTabs();
  }

  // MARK: - Public

  changeDisplayingLog(selectedTabName) { 
    console.log("Log has been clicked" , selectedTabName);
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
