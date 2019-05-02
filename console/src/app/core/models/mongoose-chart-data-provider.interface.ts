import { Observable } from "rxjs";

export interface MongooseChartDataProvider { 
    getDuration(loadStepId: string): Observable<any>; 
    getFailedOperations(loadStepId: string, period: Number); 
}