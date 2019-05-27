import { Observable } from "rxjs";
import { MongooseMetric } from "../mongoose-metric.model";
import { MetricValueType } from "./metric-value-type";

export interface MongooseChartDataProvider {

    getDuration(periodInSeconds: number, loadStepId: string, metricValueType: MetricValueType): Observable<MongooseMetric[]>;

    getAmountOfFailedOperations(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric[]>;
    getAmountOfSuccessfulOperations(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric[]>;

    // getLatencyMax(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric[]>;
    // getLatencyMin(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric[]>;

    getLatency(periodInSeconds: number, loadStepId: string, metricValueType: MetricValueType)
    
    getBandWidth(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric[]>;

}
