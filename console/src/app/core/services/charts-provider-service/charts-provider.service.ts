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
import { Observable, forkJoin } from 'rxjs';
import { NumericMetricValueType } from '../../models/chart/mongoose-chart-interface/numeric-metric-value-type';
import { ChartPoint } from '../../models/chart/mongoose-chart-interface/chart-point.model';
import { MongooseConcurrencyChart } from '../../models/chart/concurrency/mongoose-concurrency-chart.model';
import { MongooseOperationResult } from '../../models/chart/mongoose-chart-interface/mongoose-operation-result-type';


@Injectable({
  providedIn: 'root'
})
export class ChartsProviderService {


  private mongooseChartDao: MongooseChartDao;

  private durationChart: MongooseDurationChart;
  private latencyChart: MongooseLatencyChart;
  private bandwidthChart: MongooseBandwidthChart;
  private throughputChart: MongooseThroughputChart;
  private concurrencyChart: MongooseConcurrencyChart;

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

  public getConcurrencyChart(): MongooseConcurrencyChart {
    return this.concurrencyChart;
  }

  /**
   * Update every existing chart within the service.
   * @param perdiodOfUpdateSecs specification how far back in time values should be fetched, seconds 
   * @param loadStepId Mongoose's run laod step identifier 
   */
  public updateCharts(perdiodOfUpdateSecs: number, loadStepId: string) {
    this.updateDurationChart(perdiodOfUpdateSecs, loadStepId);
    this.updateLatencyChart(perdiodOfUpdateSecs, loadStepId);
    this.updateBandwidthChart(perdiodOfUpdateSecs, loadStepId);
    this.updateThoughputChart(perdiodOfUpdateSecs, loadStepId);
    this.updateConcurrencyChart(perdiodOfUpdateSecs, loadStepId);
  }

  public drawStatisCharts(secondsSinceCurrentDate: number, loadStepId: string) {
    secondsSinceCurrentDate = Math.round(secondsSinceCurrentDate);
    this.updateCharts(secondsSinceCurrentDate, loadStepId);
  }

  // MARK: - Private

  private updateLatencyChart(perdiodOfUpdateSecs: number, loadStepId: string) {
    Object.values(MetricValueType).forEach(latencyMetricType => {
      this.mongooseChartDao.getLatencyChartPoints(perdiodOfUpdateSecs, loadStepId, latencyMetricType).subscribe(
        (chartPoints: ChartPoint[]) => {
          this.latencyChart.updateChart(loadStepId, chartPoints, latencyMetricType);
        }
      )
    });
  }

  private updateDurationChart(perdiodOfUpdateSecs: number, loadStepId: string, metricValueType: MetricValueType = MetricValueType.MEAN) {
    // NOTE: Metric value type could be min ,max or mean 
    Object.values(MetricValueType).forEach(metricValueType => {
      this.mongooseChartDao.getDurationChartPoints(perdiodOfUpdateSecs, loadStepId, metricValueType).subscribe(
        ((durationChartPoints: ChartPoint[]) => {
          this.durationChart.updateChart(loadStepId, durationChartPoints, metricValueType);
        }));
    });
  }

  private updateConcurrencyChart(perdiodOfUpdateSecs: number, loadStepId: string, numericMetricValueType: NumericMetricValueType = NumericMetricValueType.LAST) {
    Object.values(NumericMetricValueType).forEach(concurrencyMetricType => {
      this.mongooseChartDao.getConcurrencyChartPoints(perdiodOfUpdateSecs, loadStepId, concurrencyMetricType).subscribe(
        (chartPoints: ChartPoint[]) => {
          this.concurrencyChart.updateChart(loadStepId, chartPoints, concurrencyMetricType);
        }
      )
    });

  }

  private updateBandwidthChart(periodOfUpdateSecs: number, loadStepId: string) {
    Object.values(NumericMetricValueType).forEach(bandwidthMetricType => {
      this.mongooseChartDao.getBandwidthChartPoints(periodOfUpdateSecs, loadStepId, bandwidthMetricType).subscribe(
        (chartPoints: ChartPoint[]) => {
          this.bandwidthChart.updateChart(loadStepId, chartPoints, bandwidthMetricType);
        }
      )
    });
  }

  private updateThoughputChart(periodOfUpdateSecs: number, loadStepId: string) {
    Object.values(MongooseOperationResult).forEach((mongooseOperationResultType: MongooseOperationResult) => { 
      Object.values(NumericMetricValueType).forEach((numericMetricType: NumericMetricValueType) => { 
        this.mongooseChartDao.getThroughtputChartPoints(periodOfUpdateSecs, loadStepId, numericMetricType, mongooseOperationResultType).subscribe(
          (chartPoints: ChartPoint[]) => {
            this.throughputChart.updateChart(loadStepId, chartPoints, numericMetricType, mongooseOperationResultType);
          }
        )
      })
    });
  }

  private configureMongooseCharts() {
    let mongooseChartRepository = new MongooseChartsRepository();

    this.durationChart = mongooseChartRepository.getDurationChart();
    this.latencyChart = mongooseChartRepository.getLatencyChart();
    this.bandwidthChart = mongooseChartRepository.getBandwidthChart();
    this.throughputChart = mongooseChartRepository.getThoughputChart();
    this.concurrencyChart = mongooseChartRepository.getConcurrencyChart();
  }

}
