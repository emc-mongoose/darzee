import { Component, OnInit } from "@angular/core";
import { MongooseChartDao } from "src/app/core/models/chart/mongoose-chart-interface/mongoose-chart-dao.mode";
import { Subscription } from "rxjs";
import { MongooseRunRecord } from "src/app/core/models/run-record.model";
import { PrometheusApiService } from "src/app/core/services/prometheus-api/prometheus-api.service";
import { MonitoringApiService } from "src/app/core/services/monitoring-api/monitoring-api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MongooseRouteParamsParser } from "src/app/core/models/mongoose-route-params-praser";
import { RoutesList } from "../../../Routing/routes-list";
import { formatDate } from "@angular/common";
import { MongooseDurationChart } from "src/app/core/models/chart/mongoose-duration-chart.model";
import { MongooseChartOptions } from "src/app/core/models/chart/mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "src/app/core/models/chart/mongoose-chart-interface/mongoose-chart-dataset.model";

@Component({
  selector: 'app-run-statistics-charts',
  templateUrl: './run-statistics-charts.component.html',
  styleUrls: ['./run-statistics-charts.component.css']
})


export class RunStatisticsChartsComponent implements OnInit {


  private mongooseChartDao: MongooseChartDao;
  public mongooseDurationChart: MongooseDurationChart; 


  private subsctiptions: Subscription = new Subscription();
  private processingRecord: MongooseRunRecord;

  // NOTE: isChartDrawActive is used to check whether the chart should be dispalyed within the UI.
  private isChartDrawActive: boolean = true; 

  constructor(private prometheusApiService: PrometheusApiService,
    private monitoringApiService: MonitoringApiService,
    private route: ActivatedRoute,
    private router: Router) {

      this.mongooseChartDao = new MongooseChartDao(this.prometheusApiService);

      let durationChartOptions = new MongooseChartOptions(); 
      let durationChartLabels: string[] = []; 
      let durationChartType = "line";
      let durationChartLegend = true; 

      let durationChartDatasetInitialValue = new MongooseChartDataset([], 'Byte per second');
      var durationChartDataset: MongooseChartDataset[] = []; 
      durationChartDataset.push(durationChartDatasetInitialValue);
      this.mongooseDurationChart = new MongooseDurationChart(durationChartOptions, durationChartLabels, durationChartType, durationChartLegend, durationChartDataset, this.mongooseChartDao);
     }

  ngOnInit() {
    this.subsctiptions.add(this.route.parent.params.subscribe(params => {
      let mongooseRouteParamsParser: MongooseRouteParamsParser = new MongooseRouteParamsParser(this.monitoringApiService);
      try { 
        mongooseRouteParamsParser.getMongooseRunRecordByLoadStepId(params).subscribe(
          foundRecord => {
            if (foundRecord == undefined) { 
              throw new Error(`Requested run record hasn't been found.`);
            }
            this.processingRecord = foundRecord;
            this.configureChartUpdateInterval();

          }
        )
      } catch (recordNotFoundError) { 
        // NOTE: Navigating back to 'Runs' page in case record hasn't been found. 
        alert(`Unable to load requested record information. Reason: ${recordNotFoundError.message}`);
        console.error(recordNotFoundError);
        this.router.navigate([RoutesList.RUNS]);
      }
    }))


  }

  ngOnDestroy() {
    clearInterval();
    this.subsctiptions.unsubscribe();
  }

  drawChart() {
    
    this.mongooseDurationChart.updateChart(this.processingRecord.getLoadStepId() as string); 
    this.isChartDrawActive = this.mongooseDurationChart.shouldDrawChart(); 
  }

  // MARK: - Private 

  private configureChartUpdateInterval() {
    this.drawChart = this.drawChart.bind(this);
    if (!this.shouldDrawChart()) { 
      this.isChartDrawActive = false; 
      alert(`Unable to draw the required chart for load step ID.`);
      return;
    }
    setInterval(this.drawChart, 2000);
  }

  private shouldDrawChart(): boolean { 
    return (this.processingRecord != undefined);
  }

}
