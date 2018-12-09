import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, observable } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AppService {
  private svgUrl : string;
  constructor(private http : HttpClient) {}

  getSvg () : Observable<JSON> {
    this.svgUrl = 'http://localhost:3000/api/datasources/proxy/1/api/v1/query_range?query=topk(5%2C%20max(scrape_duration_seconds)%20by%20(job))&start=1544373920&end=1544377560&step=40';
     return this.http.get<JSON>(this.svgUrl);
  }

}
