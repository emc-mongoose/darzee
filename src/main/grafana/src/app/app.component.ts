import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(private appService : AppService) {}

  doForMetrics(metrics) : string {
    var values = metrics['values'];
    var startTime = values[0][0];

    var x = [];
    var y = [];

    function doForEachValuePair(value) {
        x.push(value[0] - startTime);
        y.push(value[1]);
    }

    values.forEach(doForEachValuePair);

    var polyline = "<svg height=1000 width=2000><polyline ";

    var pts = "";
    for (var i = 0; i < x.length; ++i) {
        pts += x[i].toString() + ",";
        pts += Math.floor(y[i]*10000).toString() + " ";
    }

    polyline += "points='" + pts + "'";
    polyline += "style='fill:none;stroke:black;stroke-width:3'/></svg>");

    return polyline;
  }



  getSVG(): void {
    this.appService.getSvg().subscribe(data => {
      this.data = data;

      var jsonContent = this.data;
      alert(jsonContent['status']);

      var svgdiv = document.getElementById('svgdiv');
      svgdiv.innerHTML = this.doForEachMetrics(jsonContent['data']['result'][0]);;
    });
  }
  
}
