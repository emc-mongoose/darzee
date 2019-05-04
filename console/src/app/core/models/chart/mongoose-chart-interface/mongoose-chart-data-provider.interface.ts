import { Observable } from "rxjs";

export interface MongooseChartDataProvider {

    getDuration(loadStepId: string): Observable<any>;

    getAmountOfFailedOperations(periodInSeconds: number, loadStepId: string): Observable<any>;
    getAmountOfSuccessfulOperations(periodInSeconds: number, loadStepId: string): Observable<any>;

    getLatencyMax(periodInSeconds: number, loadStepId: string): Observable<any>;
    getLatencyMin(periodInSeconds: number, loadStepId: string): Observable<any>;

    getBandWidth(periodInSeconds: number, loadStepId: string): Observable<any>;

}