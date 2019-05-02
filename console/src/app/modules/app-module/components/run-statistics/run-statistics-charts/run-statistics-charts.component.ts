import { Component, OnInit } from '@angular/core';
import { MongooseChartDao } from 'src/app/core/models/mongoose-chart-dao.mode';
import { formatDate } from '@angular/common';
import { PrometheusApiService } from 'src/app/core/services/prometheus-api/prometheus-api.service';
import { RouteParams } from '../../../Routing/params.routes';
import { Router, ActivatedRoute } from '@angular/router';
import { RoutesList } from 'src/app/modules/app-module/Routing/routes-list';
import { MongooseRouteParamsParser } from 'src/app/core/models/mongoose-route-params-praser';
import { MonitoringApiService } from 'src/app/core/services/monitoring-api/monitoring-api.service';
import { Subscription } from 'rxjs';
import { MongooseRunRecord } from 'src/app/core/models/run-record.model';

@Component({
  selector: 'app-run-statistics-charts',
  templateUrl: './run-statistics-charts.component.html',
  styleUrls: ['./run-statistics-charts.component.css']
})


export class RunStatisticsChartsComponent implements OnInit {

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels = [];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartData = [
    { data: [], label: 'Byte per second' },
  ];

  private mongooseChartDao: MongooseChartDao;
  private subsctiptions: Subscription = new Subscription();
  private processingRecord: MongooseRunRecord;

  constructor(private prometheusApiService: PrometheusApiService,
    private monitoringApiService: MonitoringApiService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.subsctiptions.add(this.route.parent.params.subscribe(params => {
      let mongooseRouteParamsParser: MongooseRouteParamsParser = new MongooseRouteParamsParser(this.monitoringApiService);
      try { 
        mongooseRouteParamsParser.getMongooseRunRecordByLoadStepId(params).subscribe(
          foundRecord => {
            this.processingRecord = foundRecord;
          }
        )
      } catch (recordNotFoundError) { 
        // NOTE: Navigating back to 'Runs' page in case record hasn't been found. 
        alert(`Unable to load requested record information. Reason: ${recordNotFoundError.message}`);
        console.error(recordNotFoundError);
        this.router.navigate([RoutesList.RUNS]);
      }
    }))


    this.mongooseChartDao = new MongooseChartDao(this.prometheusApiService);
    this.configureChartUpdateInterval();
  }

  ngOnDestroy() {
    clearInterval();
    this.subsctiptions.unsubscribe();
  }

  drawChart() {

    this.mongooseChartDao.getDuration(this.processingRecord.getLoadStepId() as string).subscribe((data: any) => {
      const metricValue = data[0]["value"][1];
      const metricTimestamp = data[0]["value"][0];
      let newValue = { data: [metricValue], label: 'Byte per second' };
      this.barChartData[0].data.push(metricValue);
      this.barChartLabels.push(formatDate(Math.round(metricTimestamp * 1000), 'mediumTime', 'en-US'));
      if (this.barChartData[0].data.length >= 20) {
        this.barChartData[0].data.shift();
        this.barChartLabels.shift();
      }

      if (this.barChartData[0].data.length >= 20) {
        this.barChartData[0].data.shift();
        this.barChartLabels.shift();
      }
    });
  }

  // MARK: - Private 

  private configureChartUpdateInterval() {
    this.drawChart = this.drawChart.bind(this);
    setInterval(this.drawChart, 2000);
  }

}


export interface Result {
  data: any
}
