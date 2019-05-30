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

  public updateCharts(perdiodOfLatencyUpdateSeconds: number, loadStepId: string) {
    this.updateDurationChart(perdiodOfLatencyUpdateSeconds, loadStepId);
    this.updateLatencyChart(perdiodOfLatencyUpdateSeconds, loadStepId);
    this.updateBandwidthChart(perdiodOfLatencyUpdateSeconds, loadStepId);
    this.updateThoughputChart(perdiodOfLatencyUpdateSeconds, loadStepId);
    this.updateConcurrencyChart(perdiodOfLatencyUpdateSeconds, loadStepId);
  }

  public drawStatisCharts(secondsSinceCurrentDate: number, loadStepId: string) {
    secondsSinceCurrentDate = Math.round(secondsSinceCurrentDate);
    this.updateCharts(secondsSinceCurrentDate, loadStepId);
  }

  // MARK: - Private

  private updateLatencyChart(perdiodOfLatencyUpdateSecs: number, loadStepId: string) {
    Object.values(MetricValueType).forEach(latencyMetricType => {
      this.mongooseChartDao.getLatencyChartPoints(perdiodOfLatencyUpdateSecs, loadStepId, latencyMetricType).subscribe(
        (chartPoints: ChartPoint[]) => {
          this.latencyChart.updateChart(loadStepId, chartPoints, latencyMetricType);
        }
      )
    });
  }

  private updateDurationChart(perdiodOfLatencyUpdateSecs: number, loadStepId: string, metricValueType: MetricValueType = MetricValueType.MEAN) {
    // NOTE: Metric value type could be min ,max or mean 
    Object.values(MetricValueType).forEach(metricValueType => {
      this.mongooseChartDao.getDurationChartPoints(perdiodOfLatencyUpdateSecs, loadStepId, metricValueType).subscribe(
        ((durationChartPoints: ChartPoint[]) => {
          this.durationChart.updateChart(loadStepId, durationChartPoints, metricValueType);
        }));
    });
  }

  private updateConcurrencyChart(perdiodOfLatencyUpdateSecs: number, loadStepId: string, numericMetricValueType: NumericMetricValueType = NumericMetricValueType.LAST) {
    Object.values(NumericMetricValueType).forEach(concurrencyMetricType => {
      this.mongooseChartDao.getConcurrencyChartPoints(perdiodOfLatencyUpdateSecs, loadStepId, concurrencyMetricType).subscribe(
        (chartPoints: ChartPoint[]) => {
          this.concurrencyChart.updateChart(loadStepId, chartPoints, concurrencyMetricType);
        }
      )
    });

  }

  private updateBandwidthChart(perdiodOfLatencyUpdateSecs: number, loadStepId: string) {

    Object.values(NumericMetricValueType).forEach(bandwidthMetricType => {
      this.mongooseChartDao.getBandwidthChartPoints(perdiodOfLatencyUpdateSecs, loadStepId, bandwidthMetricType).subscribe(
        (chartPoints: ChartPoint[]) => {
          this.concurrencyChart.updateChart(loadStepId, chartPoints, bandwidthMetricType);
        }
      )
    });
  }

  private updateThoughputChart(perdiodOfLatencyUpdateSecs: number, loadStepId: string) {
    var thoughtputMetricsPool$: Observable<MongooseMetric[]>[] = [];

    let meanSuccessfulOperationMetrics$: Observable<MongooseMetric[]> = this.mongooseChartDao.getAmountOfSuccessfulOperations(perdiodOfLatencyUpdateSecs, loadStepId, NumericMetricValueType.MEAN);
    thoughtputMetricsPool$.push(meanSuccessfulOperationMetrics$);

    let lastSuccessfulOperationMetrics$: Observable<MongooseMetric[]> = this.mongooseChartDao.getAmountOfSuccessfulOperations(perdiodOfLatencyUpdateSecs, loadStepId, NumericMetricValueType.LAST);
    thoughtputMetricsPool$.push(lastSuccessfulOperationMetrics$);

    let meanFailedOperationMetrics$: Observable<MongooseMetric[]> = this.mongooseChartDao.getAmountOfFailedOperations(perdiodOfLatencyUpdateSecs, loadStepId, NumericMetricValueType.MEAN);
    thoughtputMetricsPool$.push(meanFailedOperationMetrics$);

    let lastFailedOperationMetrics$: Observable<MongooseMetric[]> = this.mongooseChartDao.getAmountOfFailedOperations(perdiodOfLatencyUpdateSecs, loadStepId, NumericMetricValueType.LAST);
    thoughtputMetricsPool$.push(lastFailedOperationMetrics$);

    forkJoin(...thoughtputMetricsPool$).subscribe(
      (fetchedMetrics: [MongooseMetric[]]) => {
        let concatenatedMetric: MongooseMetric[] = [];

        for (let metricCollection of fetchedMetrics) {
          concatenatedMetric = concatenatedMetric.concat(metricCollection);
        }

        this.throughputChart.updateChart(loadStepId, concatenatedMetric);
      }
    )
  }

  private configureMongooseCharts() {
    let mongooseChartRepository = new MongooseChartsRepository(this.mongooseChartDao);

    this.durationChart = mongooseChartRepository.getDurationChart();
    this.latencyChart = mongooseChartRepository.getLatencyChart();
    this.bandwidthChart = mongooseChartRepository.getBandwidthChart();
    this.throughputChart = mongooseChartRepository.getThoughputChart();
    this.concurrencyChart = mongooseChartRepository.getConcurrencyChart();
  }

  private getChartPointsFromMetric(mongooseMetrics: MongooseMetric[]): ChartPoint[] {
    let chartPoints: ChartPoint[] = [];
    for (let mongooseMetric of mongooseMetrics) {
      const x: number = mongooseMetric.getTimestamp();
      const y: number = new Number(mongooseMetric.getValue()) as number;
      const chartPoint = new ChartPoint(x, y);

      chartPoints.push(chartPoint);
    }
    return chartPoints;
  }

}
