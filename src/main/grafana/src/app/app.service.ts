import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, observable } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AppService {
  private svgUrl : string;

  public startSeconds : int;
  public startMinutes : int;
  public startHours : int;

  public endSeconds : int;
  public endMinutes : int;
  public endHours : int;

  constructor(private http : HttpClient) {}

  getSvg () : Observable<JSON> {
    var startTime = Math.floor(Date.now() / 86400000) * 86400 + parseInt(this.startHours, 10) * 3600 + parseInt(this.startMinutes, 10) * 60 + parseInt(this.startSeconds, 10);
    var endTime = Math.floor(Date.now() / 86400000) * 86400 + parseInt(this.endHours, 10) * 3600 + parseInt(this.endMinutes, 10) * 60 + parseInt(this.endSeconds, 10);
    this.svgUrl = 'http://localhost:3000/api/datasources/proxy/1/api/v1/query_range?query=topk(5%2C%20max(scrape_duration_seconds)%20by%20(job))&start=' + startTime.toString() + '&end=' + endTime.toString() + '&step=30';
     return this.http.get<JSON>(this.svgUrl);
  }

}
