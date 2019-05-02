import { Observable } from 'rxjs';
import { PrometheusApiService } from '../services/prometheus-api/prometheus-api.service';
import { MongooseChartDataProvider } from './mongoose-chart-data-provider.interface';

export class MongooseChartDao { 

    private chartDataProvider: MongooseChartDataProvider; 

    constructor(dataProvider: MongooseChartDataProvider) {
        console.log(`dataProvider == undefined: ${dataProvider == undefined}`);
        this.chartDataProvider = dataProvider; 
    }

    public getDuration(): Observable<any> {
         return this.chartDataProvider.getDuration(); 
    }

}