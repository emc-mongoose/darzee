import { Observable } from 'rxjs';
import { MongooseChartDataProvider } from './mongoose-chart-data-provider.interface';
import { MongooseMetric } from '../mongoose-metric.model';
import { map } from 'rxjs/operators';
import { InternalMetricNames } from '../internal-metric-names';
import { MetricValueType } from './metric-value-type';
import { NumbericMetricValueType } from './numeric-metric-value-type';

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
                        default: { 
                            throw new Error(`Internal metric name for metric type ${metricValueType} hasn't been found for latency.`)
                        }
                    }
                metrics.forEach(metric => {
                    metric.setName(internalMetricName);
                });
                return metrics;
            })
        );
    }

    /**
     * Provides metric from data provider. 
     * Data provider should impliment @interface MongooseChartDataProvider
     * @param numericMetricValueType for bandwidth can be LAST (mean the last gathered) or MEAN (mean value).
     * @returns observable array of metrics matched to requested parameters.
     */
    public getBandWidth(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumbericMetricValueType): Observable<MongooseMetric[]> {
        return this.chartDataProvider.getBandWidth(periodInSeconds, loadStepId, numericMetricValueType).pipe(
            map((metrics: MongooseMetric[]) => {
                var internalMetricName: string = undefined;
                switch (numericMetricValueType) { 
                    case (NumbericMetricValueType.LAST): { 
                        internalMetricName = InternalMetricNames.BANDWIDTH_LAST;
                        break;
                    }
                    case (NumbericMetricValueType.MEAN): { 
                        internalMetricName = InternalMetricNames.BANDWIDTH_MEAN;
                        break;
                    }
                    default: { 
                        throw new Error(`Internal metric name for numeric metric type ${numericMetricValueType} hasn't been found for bandwidth.`)
                    }
                }
                metrics.forEach(metric => {
                    metric.setName(internalMetricName);
                });
                return metrics;
            })
        );
    }

    public getAmountOfFailedOperations(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumbericMetricValueType): Observable<MongooseMetric[]> {
        return this.chartDataProvider.getAmountOfFailedOperations(periodInSeconds, loadStepId, numericMetricValueType).pipe(
            map((metrics: MongooseMetric[]) => {
                metrics.forEach(metric => {
                    metric.setName(InternalMetricNames.FAILED_OPERATIONS);
                })
                return metrics;
            })
        );
    }

    public getAmountOfSuccessfulOperations(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumbericMetricValueType): Observable<MongooseMetric[]> {
        return this.chartDataProvider.getAmountOfSuccessfulOperations(periodInSeconds, loadStepId, numericMetricValueType).pipe(
            map((metrics: MongooseMetric[]) => {
                metrics.forEach(metric => {
                    metric.setName(InternalMetricNames.SUCCESSFUL_OPERATIONS);
                })
                return metrics;
            })
        );
    }

}
