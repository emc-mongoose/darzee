import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser'

import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  getPlotURL = "";
  constructor(private appService : AppService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    var currentTime = Date.now();
    this.getPlotUrl = "http://localhost:3000/d-solo/94g2pZAiz/prometheus-2-0-stats?refresh=1m&panelId=14&orgId=1&from=" + (currentTime - 900000).toString() + "&to=" + currentTime.toString();
    this.trustedGetPlotUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getPlotUrl);
    //alert(this.trustedGetPlotUrl);
  }

  onKeyStartSeconds(event: any) {
    this.appService.startSeconds = event.target.value;
  }

  onKeyStartMinutes(event: any) {
    this.appService.startMinutes = event.target.value;
  }

  onKeyStartHours(event: any) {
    this.appService.startHours = event.target.value;
  }

  onKeyEndSeconds(event: any) {
    this.appService.endSeconds = event.target.value;
  }

  onKeyEndMinutes(event: any) {
    this.appService.endMinutes = event.target.value;
  }

  onKeyEndHours(event: any) {
    this.appService.endHours = event.target.value;
  }

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
    var svgHeight = 500;
    var svgWidth = 2000;
    var polyline = "<svg height=" + svgHeight.toString() +  " width=" + svgWidth.toString() + "><polyline ";

    var pts = "";
    for (var i = 0; i < x.length; ++i) {
        pts += x[i].toString() + ",";
        pts += (svgHeight - Math.floor(y[i]*10000)).toString() + " ";
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
      svgdiv.innerHTML = this.doForMetrics(jsonContent['data']['result'][0]);;
    });
  }
  
}
