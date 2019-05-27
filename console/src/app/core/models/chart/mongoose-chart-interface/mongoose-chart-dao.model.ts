import { Observable } from 'rxjs';
import { MongooseChartDataProvider } from './mongoose-chart-data-provider.interface';
import { MongooseMetric } from '../mongoose-metric.model';
import { map } from 'rxjs/operators';
import { InternalMetricNames } from '../internal-metric-names';
import { MetricValueType } from './metric-value-type';

export class MongooseChartDao {

    private chartDataProvider: MongooseChartDataProvider;

    constructor(dataProvider: MongooseChartDataProvider) {
        this.chartDataProvider = dataProvider;
    }

    public getDuration(periodInSeconds: number, loadStepId: string, metricValueType: MetricValueType): Observable<MongooseMetric[]> {
        return this.chartDataProvider.getDuration(periodInSeconds, loadStepId, metricValueType).pipe(
            map((durationMetrics: MongooseMetric[]) => {
                durationMetrics.forEach(metric => {
                    let internalMetricName = InternalMetricNames.MEAN_DURATION;
                    switch (metricValueType) { 
                        case (MetricValueType.MAX): { 
                            internalMetricName = InternalMetricNames.MAX_DURATION;
                            break;
                        }
                        case (MetricValueType.MIN): { 
                            internalMetricName = InternalMetricNames.MIN_DURATION;
                            break;
                        }
                        case (MetricValueType.MEAN): { 
                            internalMetricName = InternalMetricNames.MEAN_DURATION;
                            break;
                        }
                    }
                    metric.setName(internalMetricName);
                });
                return durationMetrics;
            })
        );
    }

    public getLatency(periodInSeconds: number, loadStepId: string, metricValueType: MetricValueType): Observable<MongooseMetric[]> {
        return this.chartDataProvider.getLatency(periodInSeconds, loadStepId, metricValueType).pipe(
            map((metrics: MongooseMetric[]) => {
                let internalMetricName = InternalMetricNames.LATENCY_MEAN;
                    switch (metricValueType) { 
                        case (MetricValueType.MAX): { 
                            internalMetricName = InternalMetricNames.LATENCY_MAX;
                            break;
                        }
                        case (MetricValueType.MIN): { 
                            internalMetricName = InternalMetricNames.LATENCY_MIN;
                            break;
                        }
                        case (MetricValueType.MEAN): { 
                            internalMetricName = InternalMetricNames.LATENCY_MEAN;
                            break;
                        }
                    }
                metrics.forEach(metric => {
                    metric.setName(internalMetricName);
                });
                return metrics;
            })
        );
    }

    public getBandWidth(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric[]> {
        return this.chartDataProvider.getBandWidth(periodInSeconds, loadStepId).pipe(
            map((metrics: MongooseMetric[]) => {
                metrics.forEach(metric => {
                    metric.setName(InternalMetricNames.BANDWIDTH);
                })
                return metrics;
            })
        );
    }

    public getAmountOfFailedOperations(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric[]> {
        return this.chartDataProvider.getAmountOfFailedOperations(periodInSeconds, loadStepId).pipe(
            map((metrics: MongooseMetric[]) => {
                metrics.forEach(metric => {
                    metric.setName(InternalMetricNames.FAILED_OPERATIONS);
                })
                return metrics;
            })
        );
    }

    public getAmountOfSuccessfulOperations(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric[]> {
        return this.chartDataProvider.getAmountOfSuccessfulOperations(periodInSeconds, loadStepId).pipe(
            map((metrics: MongooseMetric[]) => {
                metrics.forEach(metric => {
                    metric.setName(InternalMetricNames.SUCCESSFUL_OPERATIONS);
                })
                return metrics;
            })
        );
    }

}
