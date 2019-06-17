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

    /**
     * Assigns time points to provided run's @param metrics$ 
     * @param periodInSeconds specification how far back in time values should be fetched, seconds 
     * @param loadStepId run's load step ID
     * @param metrics$ fetched metrics. Those metris will be used as OY values.
     * @returns Chart point. OX metrics is run's elapsed time, OY is @param metrics$.
     */
    private getMatchingElapsedTimeForMetrics(periodInSeconds: number, loadStepId: string, metrics$: Observable<MongooseMetric[]>): Observable<ChartPoint[]> {
        let elapsedTimeValues$: Observable<MongooseMetric[]> = this.chartDataProvider.getElapsedTimeValue(periodInSeconds, loadStepId);

        return forkJoin(metrics$, elapsedTimeValues$).pipe(
            map((concurrencyChartData: any[]) => {
                const metricsIndex: number = 0;
                const elapsedTimeMetricsIndex: number = 1;

                let concurrencyValues: MongooseMetric[] = concurrencyChartData[metricsIndex];
                let elapsedTimeMetricsValues: MongooseMetric[] = concurrencyChartData[elapsedTimeMetricsIndex];
                console.log(`concurrencyValues length: ${concurrencyValues.length} and elapsedTimeMetricsValues length: ${elapsedTimeMetricsValues.length}`)
                let hasEnoughtValuesForChart: boolean = (concurrencyValues.length == elapsedTimeMetricsValues.length);
                if (!hasEnoughtValuesForChart) {
                    const zeroTimestamp: number = 0;
                    const zeroMetricValueMock: string = "0";
                    const zeroMetrickNameMock: string = "zero_metric_name";
                    var zeroMetricMock: MongooseMetric = new MongooseMetric(zeroTimestamp, zeroMetricValueMock, zeroMetrickNameMock);
                    // NOTE: Set zero metrick mock initially.
                    // It will be replaced if last added metric will be found.
                    var lastRecordedMetric: MongooseMetric = zeroMetricMock;
                    const differenceInArraySizeTimeAndValues: number = Math.abs(concurrencyValues.length - elapsedTimeMetricsValues.length);

                    if (concurrencyValues.length > elapsedTimeMetricsValues.length) {
                        const lastTimeMetricIndex: number = elapsedTimeMetricsValues.length;
                        lastRecordedMetric = elapsedTimeMetricsValues[lastTimeMetricIndex];
                        if (lastRecordedMetric == undefined) {
                            // WARNING: Elapsed time metric name could possibly change. Using it as a mock for now.
                            const elapsedTimeMetricName: string = "mongoose_elapsed_time_value";
                            lastRecordedMetric = new MongooseMetric(zeroTimestamp, zeroMetricValueMock, elapsedTimeMetricName);
                        }
                        for (var i: number = 0; i < differenceInArraySizeTimeAndValues; i++) {
                            // NOTE: In order to equalize array's length and draw the grapgs correctly, ...
                            // ... filling up missing metrics with the last recorded ones.
                            concurrencyValues.push(lastRecordedMetric);
                        }
                    } else if (concurrencyValues.length < elapsedTimeMetricsValues.length) {
                        const lastConcurrencyMetricIndex: number = concurrencyValues.length;
                        lastRecordedMetric = concurrencyValues[lastConcurrencyMetricIndex];
                        if (lastRecordedMetric == undefined) {
                            // WARNING: Concurrency metric could possibly change. Using it as a mock for now.
                            const elapsedTimeMetricName: string = "mongoose_concurrency_mean";
                            lastRecordedMetric = new MongooseMetric(zeroTimestamp, zeroMetricValueMock, elapsedTimeMetricName);
                        }
                        for (var i: number = 0; i < differenceInArraySizeTimeAndValues; i++) {
                            // NOTE: In order to equalize array's length and draw the grapgs correctly, ...
                            // ... filling up missing metrics with the last recorded ones.
                            concurrencyValues.push(lastRecordedMetric);
                        }
                    }

                    console.log(`Concurrrency chart has an unequal amount of time and actual value of metrics. Difference in size is ${differenceInArraySizeTimeAndValues}. Equalizing will be applied.`);

                }

                let concurrencyChartPoints: ChartPoint[] = [];
                let initialPoint: ChartPoint = this.getInitialChartPoint();
                concurrencyChartPoints.push(initialPoint);

                for (var i: number = 0; i < elapsedTimeMetricsValues.length; i++) {
                    let timestamp: MongooseMetric = elapsedTimeMetricsValues[i];
                    var concurrencyMetric: MongooseMetric = concurrencyValues[i];
                    const previousConcurrencyMetricIndex: number = i - 1;

                    if (concurrencyMetric == undefined) {
                        concurrencyMetric = concurrencyValues[previousConcurrencyMetricIndex];
                    }

                    if (timestamp == undefined) {
                        timestamp = elapsedTimeMetricsValues[previousConcurrencyMetricIndex];
                    }

                    let timestampMetricValue: string = timestamp.getValue();
                    let x: number = new Number(timestampMetricValue) as number;

                    var concurrentMetricValue: string = concurrencyMetric.getValue();
                    let y: number = new Number(concurrentMetricValue) as number;
                    let chartPoint: ChartPoint = new ChartPoint(x, y);

                    concurrencyChartPoints.push(chartPoint);
                }
                return concurrencyChartPoints;
            })
        );
    }


    /**
     * @returns (0; 0) chart point 
     */
    private getInitialChartPoint(): ChartPoint {
        const initialX: number = 0;
        const initialY: number = 0;
        return new ChartPoint(initialX, initialY);
    }

}
