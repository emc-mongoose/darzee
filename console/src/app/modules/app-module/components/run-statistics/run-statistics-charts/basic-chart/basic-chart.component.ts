import { Component, OnInit, Input } from '@angular/core';
import { MongooseChart } from 'src/app/core/models/chart/mongoose-chart-interface/mongoose-chart.interface';

@Component({
  selector: 'app-basic-chart',
  templateUrl: './basic-chart.component.html',
  styleUrls: ['./basic-chart.component.css']
})
export class BasicChartComponent implements OnInit {


  @Input() chart: MongooseChart; 
  
  constructor() { }

  ngOnInit() {
    console.log("Basic chart component has been created.")
  }

  ngOnDestroy() { 
    console.log("Basic chart component has been destroyed..")

  }

}
