import { Component, OnInit } from '@angular/core';
import { MonitoringApiService } from 'src/app/core/services/monitoring-api/monitoring-api.service';

@Component({
  selector: 'app-run-statistic-logs',
  templateUrl: './run-statistic-logs.component.html',
  styleUrls: ['./run-statistic-logs.component.css']
})
export class RunStatisticLogsComponent implements OnInit {

  private metricsName: String[] = [];

  constructor(private monitoringApiService: MonitoringApiService) { }

  // MARK: - Lifecycle

  ngOnInit() {
    this.metricsName = this.monitoringApiService.getMetricName();
  }

  // MARK: - Public

  // MARK: - Private

}
