import { Injectable } from '@angular/core';
import { PrometheusApiService } from '../prometheus-api/prometheus-api.service';
import { MongooseChartDao } from '../../models/chart/mongoose-chart-interface/mongoose-chart-dao.model';
import { MongooseMetric } from '../../models/chart/mongoose-metric.model';
import { MongooseChartsRepository } from '../../models/chart/mongoose-charts-repository';
import { MongooseDurationChart } from '../../models/chart/duration/mongoose-duration-chart.model';
import { MongooseLatencyChart } from '../../models/chart/latency/mongoose-latency-chart.model';
import { MongooseBandwidthChart } from '../../models/chart/bandwidth/mongoose-bandwidth-chart.model';
import { MongooseThroughputChart } from '../../models/chart/throughput/mongoose-throughput-chart.model';

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

  
  // MARK: - Private

  private updateLatencyChart(perdiodOfLatencyUpdateMs: number, recordLoadStepId: string) {
    this.mongooseChartDao.getLatencyMax(perdiodOfLatencyUpdateMs, recordLoadStepId).subscribe((maxLatencyResult: MongooseMetric) => {
      this.mongooseChartDao.getLatencyMin(perdiodOfLatencyUpdateMs, recordLoadStepId).subscribe((minLatencyResult: MongooseMetric) => {
        let latencyRelatedMetrics = [maxLatencyResult, minLatencyResult];
        this.latencyChart.updateChart(recordLoadStepId, latencyRelatedMetrics);
      });
    });
  }

  private configureMongooseCharts() { 
    let mongooseChartRepository = new MongooseChartsRepository(this.mongooseChartDao);
    this.durationChart = mongooseChartRepository.getDurationChart(); 
    this.latencyChart = mongooseChartRepository.getLatencyChart();
    this.bandwidthChart = mongooseChartRepository.getBandwidthChart();
    this.throughputChart = mongooseChartRepository.getThoughputChart();
  }

}

