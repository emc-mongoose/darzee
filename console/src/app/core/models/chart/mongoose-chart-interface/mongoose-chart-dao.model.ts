import { Observable } from 'rxjs';
import { MongooseChartDataProvider } from './mongoose-chart-data-provider.interface';
import { MongooseMetric } from '../mongoose-metric.model';
import { map } from 'rxjs/operators';
import { InternalMetricNames } from '../internal-metric-names';

export class MongooseChartDao {

    private chartDataProvider: MongooseChartDataProvider;

    constructor(dataProvider: MongooseChartDataProvider) {
        this.chartDataProvider = dataProvider;
    }

    public getDuration(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric[]> {
        return this.chartDataProvider.getDuration(periodInSeconds, loadStepId).pipe(
            map((durationMetrics: MongooseMetric[]) => {
                durationMetrics.forEach(metric => {
                    metric.setName(InternalMetricNames.MEAN_DURATION);
                });
                return durationMetrics;
            })
        );
    }


    public getLatencyMax(lastSecondsAmount: number, loadStepId: string): Observable<MongooseMetric[]> {
        return this.chartDataProvider.getLatencyMax(lastSecondsAmount, loadStepId).pipe(
            map((metrics: MongooseMetric[]) => {
                metrics.forEach(metric => {
                    metric.setName(InternalMetricNames.LATENCY_MAX);
                })
                return metrics;
            })
        );
    }

    public getLatencyMin(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric[]> {
        return this.chartDataProvider.getLatencyMin(periodInSeconds, loadStepId).pipe(
            map((metrics: MongooseMetric[]) => {
                metrics.forEach(metric => {
                    metric.setName(InternalMetricNames.LATENCY_MIN);
                })
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
