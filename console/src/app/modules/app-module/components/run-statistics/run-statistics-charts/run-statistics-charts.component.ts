import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
import { MongooseChart } from "src/app/core/models/chart/mongoose-chart-interface/mongoose-chart.interface";
import { Subscription } from "rxjs";
import { MongooseRunRecord } from "src/app/core/models/run-record.model";
import { BasicTab } from "src/app/common/BasicTab/BasicTab";
import { MonitoringApiService } from "src/app/core/services/monitoring-api/monitoring-api.service";
import { ChartsProviderService } from "src/app/core/services/charts-provider-service/charts-provider.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MongooseRouteParamsParser } from "src/app/core/models/mongoose-route-params-praser";
import { RoutesList } from "../../../Routing/routes-list";
import { BasicChartComponent } from "./basic-chart/basic-chart.component";
import { MongooseRunStatus } from "src/app/core/models/mongoose-run-status";



@Component({
  selector: 'app-run-statistics-charts',
  templateUrl: './run-statistics-charts.component.html',
  styleUrls: ['./run-statistics-charts.component.css']
})


export class RunStatisticsChartsComponent implements OnInit {

  @ViewChild('chartContainer', { read: ViewContainerRef}) chartContainerReference: ViewContainerRef;

  public displayingMongooseChart: MongooseChart;

  private subsctiptions: Subscription = new Subscription();
  private processingRecord: MongooseRunRecord;

  private chartTabs: BasicTab[];

  // NOTE: isChartDrawActive is used to check whether the chart should be dispalyed within the UI.
  private isChartDrawActive: boolean = true;
  private availableCharts: Map<string, MongooseChart>;
  


  constructor(private monitoringApiService: MonitoringApiService,
    private chartsProviderService: ChartsProviderService,
    private resolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private router: Router) {  }

  // MARK: - Lifecycle 

  ngOnInit() {
    this.subsctiptions.add(this.route.parent.params.subscribe(params => {
      let mongooseRouteParamsParser: MongooseRouteParamsParser = new MongooseRouteParamsParser(this.monitoringApiService);
      try {
        mongooseRouteParamsParser.getMongooseRunRecordByLoadStepId(params).subscribe(
          foundRecord => {
            if (foundRecord == undefined) {
              throw new Error(`Requested run record hasn't been found.`);
            }
            this.configureChartsRepository();
            this.configureTabs();
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

  // MARK: - Public 

  public drawChart(record: MongooseRunRecord = this.processingRecord) {
    if (record == undefined) { 
      console.error(`Unable to draw chart for an undefined record.`);
      return;
    }
    let updationPeriodSeconds = 2;
    let loadStepId = record.getLoadStepId() as string; 
    this.chartsProviderService.updateCharts(updationPeriodSeconds, loadStepId);
    this.isChartDrawActive = this.displayingMongooseChart.shouldDrawChart();
  }

  public switchTab(selectedTab: BasicTab) {
    this.chartTabs.forEach(tab => {
      let isMatchingSelectedTab = (tab.getName() == selectedTab.getName());
      tab.isActive = isMatchingSelectedTab ? true : false;
    })

    const selectedTabName = selectedTab.getName() as string;
    this.displayingMongooseChart = this.availableCharts.get(selectedTabName);
    this.createChartComponent(this.displayingMongooseChart);
  }

  public getAvailableChartTabs(): BasicTab[] {
    return this.chartTabs;
  }

  // MARK: - Private 

  private configureChartsRepository() {
    this.displayingMongooseChart = this.chartsProviderService.getDurationChart();
  }

  private getAvailableCharts(): Map<string, MongooseChart> {
    var chartsList = new Map<string, MongooseChart>();
    chartsList.set("Duration", this.chartsProviderService.getDurationChart());
    chartsList.set("Bandwidth", this.chartsProviderService.getBandwidthChart());
    chartsList.set("Throughtput", this.chartsProviderService.getThoughputChart());
    chartsList.set("Latency", this.chartsProviderService.getLatencyChart());
    return chartsList;
  }

  private configureChartUpdateInterval() {
    this.drawChart = this.drawChart.bind(this);
    if (!this.shouldDrawChart()) {
      this.isChartDrawActive = false;
      alert(`Unable to draw the required chart for load step ID.`);
      return;
    }
    if (this.shouldUpdateChart()) { 
      setInterval(this.drawChart, 2000);
      return;
    }
    this.drawChart(this.processingRecord);
  }

  private shouldUpdateChart(): boolean { 
    return (this.processingRecord.getStatus() == MongooseRunStatus.Running);
  }
  private shouldDrawChart(): boolean {
    return (this.processingRecord != undefined);
  }

  private generateChartTabs(): BasicTab[] {
    var availableTabs: BasicTab[] = [];
    for (let chartName of this.getAvailableChartNames()) {
      let samePageLink = "/";
      let tab = new BasicTab(chartName, samePageLink);
      availableTabs.push(tab);
    }
    return availableTabs;
  }

  private getAvailableChartNames(): string[] {
    if (this.availableCharts == undefined) {
      throw new Error(`Available charts haven't been set.`);
    }
    return Array.from(this.availableCharts.keys());
  }

  private configureTabs() { 
    this.availableCharts = this.getAvailableCharts();
    this.chartTabs = this.generateChartTabs();

    if (this.chartTabs.length < 0) { 
      console.error(`Tabs haven't been generated.`);
      return; 
    }
    
    let initialTabIndex = 0; 
    let initialTab =  this.chartTabs[initialTabIndex];
    this.switchTab(initialTab);
  }

  private createChartComponent(chart: MongooseChart) { 
    this.chartContainerReference.clear();
    const factory = this.resolver.resolveComponentFactory(BasicChartComponent);
    const chartComponentReference = this.chartContainerReference.createComponent(factory);
    chartComponentReference.instance.chart = this.displayingMongooseChart;
  }  

}
