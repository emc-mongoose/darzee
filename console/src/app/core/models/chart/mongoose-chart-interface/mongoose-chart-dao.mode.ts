import { Observable } from 'rxjs';
import { MongooseChartDataProvider } from './mongoose-chart-data-provider.interface';

export class MongooseChartDao { 

    private chartDataProvider: MongooseChartDataProvider; 

    constructor(dataProvider: MongooseChartDataProvider) {
        this.chartDataProvider = dataProvider; 
    }

    public getDuration(loadStepId: string): Observable<any> {
         return this.chartDataProvider.getDuration(loadStepId); 
    }

}