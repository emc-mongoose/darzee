import { Observable } from "rxjs";

export interface MongooseChartDataProvider { 

    getDuration(loadStepId: string): Observable<any>; 

    getAmountOfFailedOperations(loadStepId: string, period: Number): Observable<any>; 
    getAmountOfSuccessfulOperations(loadStepId: string, period: Number): Observable<any>; 

    getLatencyMax(periodInSeconds: number, loadStepId: string): Observable<any>; 
    getLatencyMin(periodInSeconds: number, loadStepId: string): Observable<any>; 

    getBandWidth(periodInSeconds: number, loadStepId: string): Observable<any>; 

}