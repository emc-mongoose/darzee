import { Component, OnInit } from '@angular/core';
import { MongooseChartDao } from 'src/app/core/models/mongoose-chart-dao.mode';
import { formatDate } from '@angular/common';
import { PrometheusApiService } from 'src/app/core/services/prometheus-api/prometheus-api.service';

@Component({
  selector: 'app-run-statistics-charts',
  templateUrl: './run-statistics-charts.component.html',
  styleUrls: ['./run-statistics-charts.component.css']
})


export class RunStatisticsChartsComponent implements OnInit {

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels = [];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartData = [
    {data: [], label: 'Byte per second'},
  ];

  mongooseChartDao: MongooseChartDao;

  constructor(private prometheusApiService: PrometheusApiService) { 
    console.log(`[constructor] is this.prometheusApiService undefined : ${this.prometheusApiService == undefined}`)
    console.log(`[function] is this.prometheusApiService undefined: ${this.prometheusApiService == undefined}`)


  }

  ngOnInit() {
    this.mongooseChartDao = new MongooseChartDao(this.prometheusApiService);
    this.configureChartUpdateInterval();
  }

  ngOnDestroy() { 
    clearInterval(); 
  }

  showBandwidth() {

    this.mongooseChartDao.getDuration().subscribe((data: any) => {
      const metricValue = data[0]["value"][1]; 
      const metricTimestamp = data[0]["value"][0]; 
      let newValue = {data: [metricValue], label: 'Byte per second'};
      this.barChartData[0].data.push(metricValue);
      this.barChartLabels.push(formatDate(Math.round(metricTimestamp * 1000), 'mediumTime', 'en-US'));
      if (this.barChartData[0].data.length >= 20){
        this.barChartData[0].data.shift();
        this.barChartLabels.shift();
      }

      if (this.barChartData[0].data.length >= 20) {
        this.barChartData[0].data.shift();
        this.barChartLabels.shift();
      }
    });
  }

  // MARK: - Private 
  
  private configureChartUpdateInterval() { 
    this.showBandwidth = this.showBandwidth.bind(this);
    setInterval(this.showBandwidth, 2000);


  }

}


export interface Result {
  data: any
}
