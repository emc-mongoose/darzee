import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Constants } from 'src/app/common/constants';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PrometheusApiService {

  readonly API_BASE = Constants.Http.HTTP_PREFIX + Constants.Configuration.PROMETHEUS_IP + "/api/v1/";


  constructor(private httpClient: HttpClient) { }

  public runQuery(query: String): Observable<any> {
    let queryRequest = "query?query=";
    return this.httpClient.get(this.API_BASE + queryRequest + query, Constants.Http.JSON_CONTENT_TYPE);
  }

  public getDataForMetric(metric: String): Observable<any> {
    return this.runQuery(metric).pipe(
      map((rawResponse: any) => this.extractLabrlsFromMetric(rawResponse))
    )
  }

  private extractLabrlsFromMetric(rawMetric: any): any {
    // NOTE: As for 21.03.2019, Ptometheus stores array of result for a query ...
    // ... within response's data.result field.

    let dataField = "data";
    let resultFieldTag = "result";

    let labelsOfMetric = rawMetric[dataField][resultFieldTag];
    if (labelsOfMetric == undefined) {
      let misleadingMsg = "Unable to fetch Mongoose Run List. Field 'data.result' doesn't exist.";
      console.log(misleadingMsg);
      throw new Error(misleadingMsg);
    }
    console.log("[extracting] labelsOfMetric: ", labelsOfMetric);
    return labelsOfMetric;
  }
}
