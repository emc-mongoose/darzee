import { Observable } from "rxjs";
import { MongooseMetric } from "../mongoose-metric.model";

export interface MongooseChartDataProvider {

    getDuration(loadStepId: string): Observable<MongooseMetric>;

    getAmountOfFailedOperations(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric>;
    getAmountOfSuccessfulOperations(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric>;

    getLatencyMax(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric>;
    getLatencyMin(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric>;

    getBandWidth(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric>;

}