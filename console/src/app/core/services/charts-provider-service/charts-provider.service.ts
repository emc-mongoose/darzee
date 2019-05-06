import { Injectable } from '@angular/core';
import { PrometheusApiService } from '../prometheus-api/prometheus-api.service';
import { MongooseChartDao } from '../../models/chart/mongoose-chart-interface/mongoose-chart-dao.model';

@Injectable({
  providedIn: 'root'
})
export class ChartsProviderService {

  private mongooseChartDao: MongooseChartDao;

  constructor(prometheusApiService: PrometheusApiService) {
    // NOTE: Prometheus API service is data provider for Mongoose Charts.
    this.mongooseChartDao = new MongooseChartDao(prometheusApiService);
   }  
}
