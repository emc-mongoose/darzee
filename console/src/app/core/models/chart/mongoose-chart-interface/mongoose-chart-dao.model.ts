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

    public getDuration(periodInSeconds: number, loadStepId: string): Observable<any> {
        return this.chartDataProvider.getDuration(periodInSeconds, loadStepId).pipe(
            map(metric => {
                metric.setName(InternalMetricNames.DURATION);
                return metric;
            })
        );
    }

    public getDurationArray(periodInSeconds: number, loadStepId: string): Observable<any> {
        return this.chartDataProvider.getDurationValuesArray(periodInSeconds, loadStepId).pipe(
            map((metrics: MongooseMetric[]) => {
                console.log(`charts DAO, length of duration array: ${metrics.length}`);
                metrics.forEach(metric => {
                    metric.setName(InternalMetricNames.DURATION);
                })
                return metrics;
            })
        )
    }

    public getLatencyMax(lastSecondsAmount: number, loadStepId: string): Observable<MongooseMetric> {
        return this.chartDataProvider.getLatencyMax(lastSecondsAmount, loadStepId).pipe(
            map(metric => {
                metric.setName(InternalMetricNames.LATENCY_MAX);
                return metric;
            })
        );
    }

    public getLatencyMin(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric> {
        return this.chartDataProvider.getLatencyMin(periodInSeconds, loadStepId).pipe(
            map(metric => {
                metric.setName(InternalMetricNames.LATENCY_MIN);
                return metric;
            })
        );
    }

    public getBandWidth(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric> {
        return this.chartDataProvider.getBandWidth(periodInSeconds, loadStepId).pipe(
            map(metric => {
                metric.setName(InternalMetricNames.BANDWIDTH);
                return metric;
            })
        );
    }

    public getAmountOfFailedOperations(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric> {
        return this.chartDataProvider.getAmountOfFailedOperations(periodInSeconds, loadStepId).pipe(
            map(metric => {
                metric.setName(InternalMetricNames.FAILED_OPERATIONS);
                return metric;
            })
        );
    }

    public getAmountOfSuccessfulOperations(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric> {
        return this.chartDataProvider.getAmountOfSuccessfulOperations(periodInSeconds, loadStepId).pipe(
            map(metric => {
                metric.setName(InternalMetricNames.SUCCESSFUL_OPERATIONS);
                return metric;
            })
        );
    }

}
