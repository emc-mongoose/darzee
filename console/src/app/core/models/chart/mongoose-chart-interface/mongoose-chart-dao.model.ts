import { Observable, forkJoin } from 'rxjs';
import { MongooseChartDataProvider } from './mongoose-chart-data-provider.interface';
import { MongooseMetric } from '../mongoose-metric.model';
import { map } from 'rxjs/operators';
import { InternalMetricNames } from '../internal-metric-names';
import { MetricValueType } from './metric-value-type';
import { NumericMetricValueType } from './numeric-metric-value-type';
import { ChartPoint } from './chart-point.model';
import { MongooseOperationResult } from './mongoose-operation-result-type';

/**
 * Data access object for Mongoose charts' related data. 
 * It retrieves data from @interface MongooseChartDataProvider .
 */
export class MongooseChartDao {

    private chartDataProvider: MongooseChartDataProvider;

    constructor(dataProvider: MongooseChartDataProvider) {
        this.chartDataProvider = dataProvider;
    }

    public getDurationChartPoints(periodInSeconds: number, loadStepId: string, metricValue: MetricValueType): Observable<ChartPoint[]> {
        let durationMetrics$: Observable<MongooseMetric[]> = this.chartDataProvider.getDuration(periodInSeconds, loadStepId, metricValue);
        return this.getMatchingElapsedTimeForMetrics(periodInSeconds, loadStepId, durationMetrics$);
    }

    public getConcurrencyChartPoints(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumericMetricValueType): Observable<ChartPoint[]> {
        let concurrencyMetrics$: Observable<MongooseMetric[]> = this.chartDataProvider.getConcurrency(periodInSeconds, loadStepId, numericMetricValueType);
        return this.getMatchingElapsedTimeForMetrics(periodInSeconds, loadStepId, concurrencyMetrics$);
    }

    public getLatencyChartPoints(periodInSeconds: number, loadStepId: string, metricValue: MetricValueType): Observable<ChartPoint[]> { 
        let latencyMetrics$: Observable<MongooseMetric[]> = this.chartDataProvider.getLatency(periodInSeconds, loadStepId, metricValue);
        return this.getMatchingElapsedTimeForMetrics(periodInSeconds, loadStepId, latencyMetrics$);
    }

    public getBandwidthChartPoints(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumericMetricValueType): Observable<ChartPoint[]> { 
        let bandwidthMetrics$: Observable<MongooseMetric[]> = this.chartDataProvider.getBandWidth(periodInSeconds, loadStepId, numericMetricValueType);
        return this.getMatchingElapsedTimeForMetrics(periodInSeconds, loadStepId, bandwidthMetrics$);
    }

    public getThroughtputChartPoints(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumericMetricValueType, operationResultType: MongooseOperationResult): Observable<ChartPoint[]> { 

        let throughtputMetrics$: Observable<MongooseMetric[]> = undefined; 
        const isSuccessfulOperation: boolean = (operationResultType == MongooseOperationResult.SUCCESSFUL);
        if (isSuccessfulOperation) { 
            throughtputMetrics$ = this.chartDataProvider.getAmountOfSuccessfulOperations(periodInSeconds, loadStepId, numericMetricValueType);
        } else { 
            throughtputMetrics$ = this.chartDataProvider.getAmountOfFailedOperations(periodInSeconds, loadStepId, numericMetricValueType);
        }

        return this.getMatchingElapsedTimeForMetrics(periodInSeconds, loadStepId, throughtputMetrics$);
    }

    private getMatchingElapsedTimeForMetrics(periodInSeconds: number, loadStepId: string, metrics$: Observable<MongooseMetric[]>): Observable<ChartPoint[]> { 
        let elapsedTimeValues$: Observable<MongooseMetric[]> = this.chartDataProvider.getElapsedTimeValue(periodInSeconds, loadStepId);

        return forkJoin(metrics$, elapsedTimeValues$).pipe(
            map((concurrencyChartData: any[]) => {
                const metricsIndex: number = 0;
                const elapsedTimeMetricsIndex: number = 1;

                let concurrencyValues: MongooseMetric[] = concurrencyChartData[metricsIndex];
                let elapsedTimeMetricsValues: MongooseMetric[] = concurrencyChartData[elapsedTimeMetricsIndex];

                let hasEnoughtValuesForChart: boolean = (concurrencyValues.length == elapsedTimeMetricsValues.length);
                if (!hasEnoughtValuesForChart) {
                    throw new Error(`Unable to build concurrency chart due to lack of metrics. Concurrency metrics amount: ${concurrencyValues.length}, while matching time metrics amount of: ${elapsedTimeMetricsValues.length}`);
                }

                let concurrencyChartPoints: ChartPoint[] = [];
                for (var i: number = 0; i < elapsedTimeMetricsValues.length; i++) {
                    let timestamp: MongooseMetric = elapsedTimeMetricsValues[i];
                    let concurrencyMetric: MongooseMetric = concurrencyValues[i];

                    let x: number = new Number(timestamp.getValue()) as number;
                    let y: number = new Number(concurrencyMetric.getValue()) as number;
                    let chartPoint: ChartPoint = new ChartPoint(x, y);

                    concurrencyChartPoints.push(chartPoint);
                }
                return concurrencyChartPoints;
            })
        );
    }

}
