import { Observable } from 'rxjs';
import { PrometheusApiService } from '../services/prometheus-api/prometheus-api.service';
import { MongooseChartDataProvider } from './mongoose-chart-data-provider.interface';

export class PrometheusChartDao { 

    private chartDataProvider: MongooseChartDataProvider; 

    constructor(private prometheusApiService: PrometheusApiService) {
        this.chartDataProvider = prometheusApiService; 
    }

    public getDuration(): Observable<any> {
         return this.chartDataProvider.getDuration(); 
    }

}