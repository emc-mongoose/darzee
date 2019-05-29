import { Observable } from "rxjs";
import { MongooseMetric } from "../mongoose-metric.model";
import { MetricValueType } from "./metric-value-type";
import { NumbericMetricValueType } from "./numeric-metric-value-type";

export interface MongooseChartDataProvider {

    getDuration(periodInSeconds: number, loadStepId: string, metricValueType: MetricValueType): Observable<MongooseMetric[]>;

    getAmountOfFailedOperations(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumbericMetricValueType): Observable<MongooseMetric[]>;
    getAmountOfSuccessfulOperations(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumbericMetricValueType): Observable<MongooseMetric[]>;

    // getLatencyMax(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric[]>;
    // getLatencyMin(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric[]>;

    getLatency(periodInSeconds: number, loadStepId: string, metricValueType: MetricValueType)
    
      /**
   * @throws Error in non-existing @param numericMetricValueType has been passed as argument.
   * @param periodInSeconds amount of period for metrics scaping (seconds).
   * @param loadStepId Mongoose's load step ID for a specific run.
   * @param numericMetricValueType Type of byte rate metric (mean, last).
   */
    getBandWidth(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumbericMetricValueType): Observable<MongooseMetric[]>;

    getConcurrency(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumbericMetricValueType): Observable<MongooseMetric[]>;

    getElapsedTimeValue(periodInSeconds: number, loadStepId: string, numericMetricValueType): Observable<MongooseMetric[]>;

}
