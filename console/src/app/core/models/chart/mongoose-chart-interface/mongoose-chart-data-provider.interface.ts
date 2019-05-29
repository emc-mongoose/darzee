import { Observable } from "rxjs";
import { MongooseMetric } from "../mongoose-metric.model";
import { MetricValueType } from "./metric-value-type";
import { NumericMetricValueType } from "./numeric-metric-value-type";

/**
 * Describes necessary function for provider of Mongoose metrics.
 */
export interface MongooseChartDataProvider {

  /** 
   * @returns Duration-related Mongoose's metrics.
    * @throws Error in non-existing @param metricValueType has been passed as argument.
    * @param periodInSeconds amount of period for metrics scaping (seconds).
    * @param loadStepId Mongoose's load step ID for a specific run.
    * @param metricValueType Type of Latency metric (mean, max, min).
    */
  getDuration(periodInSeconds: number, loadStepId: string, metricValueType: MetricValueType): Observable<MongooseMetric[]>;

  /** 
   * @returns Amount of failed operations performed by Mongoose from given period.
    * @throws Error in non-existing @param numericMetricValueType has been passed as argument.
    * @param periodInSeconds amount of period for metrics scaping (seconds).
    * @param loadStepId Mongoose's load step ID for a specific run.
    * @param numericMetricValueType Type of byte rate metric (mean, last).
    */
  getAmountOfFailedOperations(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumericMetricValueType): Observable<MongooseMetric[]>;

  /** 
   * @returns Amount of successful operations performed by Mongoose from given period.
    * @throws Error in non-existing @param numericMetricValueType has been passed as argument.
    * @param periodInSeconds amount of period for metrics scaping (seconds).
    * @param loadStepId Mongoose's load step ID for a specific run.
    * @param numericMetricValueType Type of byte rate metric (mean, last).
    */
  getAmountOfSuccessfulOperations(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumericMetricValueType): Observable<MongooseMetric[]>;

  /** 
   * @returns Latency-related Mongoose's metrics.
    * @throws Error in non-existing @param metricValueType has been passed as argument.
    * @param periodInSeconds amount of period for metrics scaping (seconds).
    * @param loadStepId Mongoose's load step ID for a specific run.
    * @param metricValueType Type of Latency metric (mean, max, min).
    */
  getLatency(periodInSeconds: number, loadStepId: string, metricValueType: MetricValueType)

  /** 
   * @returns Bandwidth-related Mongoose's metrics..
    * @throws Error in non-existing @param numericMetricValueType has been passed as argument.
    * @param periodInSeconds amount of period for metrics scaping (seconds).
    * @param loadStepId Mongoose's load step ID for a specific run.
    * @param numericMetricValueType Type of byte rate metric (mean, last).
    */
  getBandWidth(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumericMetricValueType): Observable<MongooseMetric[]>;

  /**
   * @returns Concurrency-related Mongoose's metrics.
    * @throws Error in non-existing @param numericMetricValueType has been passed as argument.
    * @param periodInSeconds amount of period for metrics scaping (seconds).
    * @param loadStepId Mongoose's load step ID for a specific run.
    * @param numericMetricValueType Type of concurrency metric (mean, last).
    */
  getConcurrency(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumericMetricValueType): Observable<MongooseMetric[]>;


  /**
   * @returns Mongoose's elapsed time value from given time period (@param periodInSeconds) for ...
   * ... specified Mongoose's @param loadStepId 
   */
  getElapsedTimeValue(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric[]>;
}
