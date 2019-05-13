import { Injectable } from '@angular/core';
import { PrometheusApiService } from '../prometheus-api/prometheus-api.service';
import { MongooseChartDao } from '../../models/chart/mongoose-chart-interface/mongoose-chart-dao.model';
import { MongooseMetric } from '../../models/chart/mongoose-metric.model';
import { MongooseChartsRepository } from '../../models/chart/mongoose-charts-repository';
import { MongooseDurationChart } from '../../models/chart/duration/mongoose-duration-chart.model';
import { MongooseLatencyChart } from '../../models/chart/latency/mongoose-latency-chart.model';
import { MongooseBandwidthChart } from '../../models/chart/bandwidth/mongoose-bandwidth-chart.model';
import { MongooseThroughputChart } from '../../models/chart/throughput/mongoose-throughput-chart.model';
import { MongooseChart } from '../../models/chart/mongoose-chart-interface/mongoose-chart.interface';
import { MongooseRunRecord } from '../../models/run-record.model';
import { MongooseRunStatus } from '../../models/mongoose-run-status';

@Injectable({
  providedIn: 'root'
})
export class ChartsProviderService {

  private readonly PERIOD_OF_DATA_UPDATE_SECONDS = 2;

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
    this.updateLatencyChart(perdiodOfLatencyUpdateSeconds, loadStepId);
    this.updateDurationChart(perdiodOfLatencyUpdateSeconds, loadStepId);
    this.updateBandwidthChart(perdiodOfLatencyUpdateSeconds, loadStepId);
    this.updateThoughputChart(perdiodOfLatencyUpdateSeconds, loadStepId);
  }

  public drawStatisCharts(secondsSinceCurrentDate: number, loadStepId: string) {
    secondsSinceCurrentDate = Math.round(secondsSinceCurrentDate);
    console.log(`Update static charts for loadStepId ${loadStepId} for the past ${secondsSinceCurrentDate} seconds.`);
    this.updateStaticDurationChart(secondsSinceCurrentDate, loadStepId);
  }

  // MARK: - Private

  private updateLatencyChart(perdiodOfLatencyUpdateSecs: number, loadStepId: string) {
    this.mongooseChartDao.getLatencyMax(perdiodOfLatencyUpdateSecs, loadStepId).subscribe((maxLatencyResult: MongooseMetric) => {
      this.mongooseChartDao.getLatencyMin(perdiodOfLatencyUpdateSecs, loadStepId).subscribe((minLatencyResult: MongooseMetric) => {
        let latencyRelatedMetrics = [maxLatencyResult, minLatencyResult];
        this.latencyChart.updateChart(loadStepId, latencyRelatedMetrics);
      });
    });
  }

  private updateDurationChart(perdiodOfLatencyUpdateSecs: number, loadStepId: string) {
    this.mongooseChartDao.getDuration(perdiodOfLatencyUpdateSecs, loadStepId).subscribe(
      ((durationMetrics: MongooseMetric[]) => {
      this.durationChart.updateChart(loadStepId, durationMetrics);
    }));
  }

  private updateStaticDurationChart(periodOfDataRequestSeconds: number, loadStepId: string) {
    this.mongooseChartDao.getDurationArray(periodOfDataRequestSeconds, loadStepId).subscribe(
      (metrics: MongooseMetric[]) => {
        this.durationChart.updateChart(loadStepId, metrics);
      }
    )

  }

  private updateBandwidthChart(perdiodOfLatencyUpdateSecs: number, loadStepId: string) {
    this.mongooseChartDao.getBandWidth(perdiodOfLatencyUpdateSecs, loadStepId).subscribe((byteRateMean: MongooseMetric) => {
      let bandwidthRelatedMetrics = [byteRateMean];
      this.bandwidthChart.updateChart(loadStepId, bandwidthRelatedMetrics);
    });
  }

  private updateThoughputChart(perdiodOfLatencyUpdateSecs: number, loadStepId: string) {
    this.mongooseChartDao.getAmountOfSuccessfulOperations(this.PERIOD_OF_DATA_UPDATE_SECONDS, loadStepId).subscribe((sucessfulOperationAmount: MongooseMetric) => {
      this.mongooseChartDao.getAmountOfFailedOperations(this.PERIOD_OF_DATA_UPDATE_SECONDS, loadStepId).subscribe((failedOperationsMetric: MongooseMetric) => {
        let thoughtputRelatedMetrics = [sucessfulOperationAmount, failedOperationsMetric];
        this.throughputChart.updateChart(loadStepId, thoughtputRelatedMetrics);
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
