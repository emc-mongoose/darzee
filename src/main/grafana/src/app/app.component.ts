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

  constructor(private appService : AppService, private sanitizer: DomSanitizer) {}

  svgHeight = 150;
  svgWidth = 200;

  ngOnInit() {
    var currentTime = Date.now();
    // Here should be grafana server URL for a panel
    var getPlotUrl = "http://localhost:3000/d-solo/94g2pZAiz/prometheus-2-0-stats?refresh=1m&panelId=14&orgId=1&from=" + (currentTime - 900000).toString() + "&to=" + currentTime.toString();
    // Getting safe resource URL to avoid blocking of the GET request
    this.trustedGetPlotUrl = this.sanitizer.bypassSecurityTrustResourceUrl(getPlotUrl);
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

  normalizePointArray(x) {
    var maxX = Math.max.apply(null, x);
    maxX = maxX * 1.1; // Adding a little margin for values
    for (var i = 0; i < x.length; i++) {
       x[i] = x[i] / maxX;
    }
  }

  makePointsArrayString(x, y) {
    var points = "";
    for (var i = 0; i < x.length; ++i) {
        points += Math.floor(x[i]*this.svgWidth).toString() + ",";
        points += (this.svgHeight - Math.floor(y[i]*this.svgHeight)).toString() + " ";
    }
    return points;
  }

  makeSvgFromData(x, y) {
    
    this.normalizePointArray(x);
    this.normalizePointArray(y);

    var svgHtmlTag = "<svg height='" + this.svgHeight.toString() +  "' width='" + this.svgWidth.toString() + "'>";
    var polylineSvgTag = "<polyline ";

    polylineSvgTag += "points='" + this.makePointsArrayString(x, y) + "'";
    polylineSvgTag += " style='fill:none; stroke:black; stroke-width:3'/>");

    svgHtmlTag += polylineSvgTag;
    svgHtmlTag += '</svg>';

    return svgHtmlTag;
  }

  makeSvgDownloadLink(svgContent) {
    var encodedSvg = encodeURIComponent(svgContent);
    var filename = "plot.svg";
    var downloadLink = '<p><a href="data:text/plain;charset=utf-8,' + encodedSvg + '" download=' + filename + '>Download SVG</a></p>';
    return downloadLink;
  }

  // Processing points from JSON
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

    var svgContent = this.makeSvgFromData(x, y);
    var downloadLink = this.makeSvgDownloadLink(svgContent);
    return svgContent + downloadLink;
  }



  getSVG(): void {
    this.appService.getSvg().subscribe(data => {
      this.data = data;
      var jsonContent = this.data;

      var svgdiv = document.getElementById('svgdiv');
      svgdiv.innerHTML = this.doForMetrics(jsonContent['data']['result'][0]);;
    });
  }
  
}
