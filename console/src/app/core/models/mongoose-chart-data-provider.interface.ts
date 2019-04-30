import { Observable } from "rxjs";

export interface MongooseChartDataProvider { 
    getDuration(): Observable<any>; 
    getFailedOperations(period: Number); 
}