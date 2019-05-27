import { Injectable } from '@angular/core';
import { PrometheusApiService } from '../prometheus-api/prometheus-api.service';
import { MongooseChartDao } from '../../models/chart/mongoose-chart-interface/mongoose-chart-dao.model';
import { MongooseMetric } from '../../models/chart/mongoose-metric.model';
import { MongooseChartsRepository } from '../../models/chart/mongoose-charts-repository';
import { MongooseDurationChart } from '../../models/chart/duration/mongoose-duration-chart.model';
import { MongooseLatencyChart } from '../../models/chart/latency/mongoose-latency-chart.model';
import { MongooseBandwidthChart } from '../../models/chart/bandwidth/mongoose-bandwidth-chart.model';
import { MongooseThroughputChart } from '../../models/chart/throughput/mongoose-throughput-chart.model';
import { MetricValueType } from '../../models/chart/mongoose-chart-interface/metric-value-type';


@Injectable({
  providedIn: 'root'
})
export class ChartsProviderService {


  private mongooseChartDao: MongooseChartDao;

  private durationChart: MongooseDurationChart;
  private latencyChart: MongooseLatencyChart;
  private bandwidthChart: MongooseBandwidthChart;
  private throughputChart: MongooseThroughputChart;

  constructor(prometheusApiService: PrometheusApiService) {
    // NOTE: Prometheus API service is data provider for Mongoose Charts.
    this.mongooseChartDao = new MongooseChartDao(prometheusApiService);
    this.configureMongooseCharts();
  }

  // MARK: - Public


  public getDurationChart(): MongooseDurationChart {
    return this.durationChart;
  }

  public getBandwidthChart(): MongooseBandwidthChart {
    return this.bandwidthChart;
  }

  public getThoughputChart(): MongooseThroughputChart {
    return this.throughputChart;
  }

  public getLatencyChart(): MongooseLatencyChart {
    return this.latencyChart;
  }

  public updateCharts(perdiodOfLatencyUpdateSeconds: number, loadStepId: string) {
    this.updateDurationChart(perdiodOfLatencyUpdateSeconds, loadStepId);


    this.updateLatencyChart(perdiodOfLatencyUpdateSeconds, loadStepId);
    this.updateBandwidthChart(perdiodOfLatencyUpdateSeconds, loadStepId);
    this.updateThoughputChart(perdiodOfLatencyUpdateSeconds, loadStepId);
  }

  public drawStatisCharts(secondsSinceCurrentDate: number, loadStepId: string) {
    secondsSinceCurrentDate = Math.round(secondsSinceCurrentDate);
    console.log(`Update static charts for loadStepId ${loadStepId} for the past ${secondsSinceCurrentDate} seconds.`);
    this.updateCharts(secondsSinceCurrentDate, loadStepId);
  }

  // MARK: - Private

  private updateLatencyChart(perdiodOfLatencyUpdateSecs: number, loadStepId: string) {
    this.mongooseChartDao.getLatencyMax(perdiodOfLatencyUpdateSecs, loadStepId).subscribe((maxLatencyResult: MongooseMetric[]) => {
      this.mongooseChartDao.getLatencyMin(perdiodOfLatencyUpdateSecs, loadStepId).subscribe((minLatencyResult: MongooseMetric[]) => {
        // NOTE: Concadentation of the arrays due tothe specific logic of updating (based on the internal names)
        let concatenatedMetrics = maxLatencyResult.concat(minLatencyResult);
        this.latencyChart.updateChart(loadStepId, concatenatedMetrics);
      });
    });
  }

  private updateDurationChart(perdiodOfLatencyUpdateSecs: number, loadStepId: string, metricValueType: MetricValueType = MetricValueType.MEAN) {
   // NOTE: Metric value type could be min ,max or mean 
    Object.values(MetricValueType).forEach(metricValueType => { 
      this.mongooseChartDao.getDuration(perdiodOfLatencyUpdateSecs, loadStepId, metricValueType).subscribe(
        ((durationMetrics: MongooseMetric[]) => {
          this.durationChart.updateChart(loadStepId, durationMetrics);
        }));
    })
  }



  private updateBandwidthChart(perdiodOfLatencyUpdateSecs: number, loadStepId: string) {
    this.mongooseChartDao.getBandWidth(perdiodOfLatencyUpdateSecs, loadStepId).subscribe((byteRateMean: MongooseMetric[]) => {
      this.bandwidthChart.updateChart(loadStepId, byteRateMean);
    });
  }

  private updateThoughputChart(perdiodOfLatencyUpdateSecs: number, loadStepId: string) {
    this.mongooseChartDao.getAmountOfSuccessfulOperations(perdiodOfLatencyUpdateSecs, loadStepId).subscribe((sucessfulOperationsMetrics: MongooseMetric[]) => {
      this.mongooseChartDao.getAmountOfFailedOperations(perdiodOfLatencyUpdateSecs, loadStepId).subscribe((failedOperationsMetrics: MongooseMetric[]) => {
        console.log(`failedOperationsMetrics length: ${failedOperationsMetrics.length}`)
        let concatenatedThoughtputRelatedMetrics = sucessfulOperationsMetrics.concat(failedOperationsMetrics);
        this.throughputChart.updateChart(loadStepId, concatenatedThoughtputRelatedMetrics);
      })
    })
  }

  private configureMongooseCharts() {
    let mongooseChartRepository = new MongooseChartsRepository(this.mongooseChartDao);

    this.durationChart = mongooseChartRepository.getDurationChart();
    this.latencyChart = mongooseChartRepository.getLatencyChart();
    this.bandwidthChart = mongooseChartRepository.getBandwidthChart();
    this.throughputChart = mongooseChartRepository.getThoughputChart();
  }

}
