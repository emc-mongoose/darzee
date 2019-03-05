import { Component, OnInit } from '@angular/core';
import { MonitoringApiService } from 'src/app/core/services/monitoring-api/monitoring-api.service';

@Component({
  selector: 'app-run-statistic-logs',
  templateUrl: './run-statistic-logs.component.html',
  styleUrls: ['./run-statistic-logs.component.css']
})
export class RunStatisticLogsComponent implements OnInit {

  private metricsName: String[] = [];
  private displayingLog = ' mongoose_duration_count{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 2981.0 \n mongoose_duration_sum{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 0.060955 mongoose_duration_count{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 2981.0 \n mongoose_duration_sum{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 0.060955 mongoose_duration_count{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 2981.0 \n mongoose_duration_sum{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 0.060955 mongoose_duration_count{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 2981.0 \n mongoose_duration_sum{load_step_id="robotest",load_op_type="CREATE",storage_driver_limit_concurrency="1",item_data_size="1MB",start_time="1544351424363",node_list="[]",user_comment="",} 0.060955';
  constructor(private monitoringApiService: MonitoringApiService) { }

  // MARK: - Lifecycle

  ngOnInit() {
    this.metricsName = this.monitoringApiService.getMetricName();
  }

  // MARK: - Public

  // MARK: - Private

}
