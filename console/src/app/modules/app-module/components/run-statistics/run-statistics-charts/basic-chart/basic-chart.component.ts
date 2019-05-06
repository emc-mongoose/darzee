import { Component, OnInit, Input } from '@angular/core';
import { MongooseChart } from 'src/app/core/models/chart/mongoose-chart-interface/mongoose-chart.interface';

@Component({
  selector: 'app-basic-chart',
  templateUrl: './basic-chart.component.html',
  styleUrls: ['./basic-chart.component.css']
})
export class BasicChartComponent {


  @Input() chart: MongooseChart; 
  
  constructor() { }


}
