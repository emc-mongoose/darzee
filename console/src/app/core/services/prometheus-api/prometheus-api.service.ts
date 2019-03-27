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
  
  // NOTE: Symbols used for queryting Prometheus for value of metric with specific labels. They ...
  // ... are listed within the labels list. 
  readonly METRIC_LABELS_LIST_START_SYMBOL = "{";
  readonly METRIC_LABELS_LIST_END_SYMBOL = "}";

  // MARK: - Lifecycle 

  constructor(private httpClient: HttpClient) { }

  // MARK: - Public 

  public runQuery(query: String): Observable<any> {
    let queryRequest = "query?query=";
    return this.httpClient.get(this.API_BASE + queryRequest + query, Constants.Http.JSON_CONTENT_TYPE).pipe(
      map((rawResponse: any) => this.extractResultPayload(rawResponse))
    );
  }

  public getDataForMetric(metric: String): Observable<any> {
    return this.runQuery(metric);
  }

  public getDataForMetricWithLabels(metric: String, labels: Map<String, String>): Observable<any> {
    let targetLabelsNames = Array.from(labels.keys());

    // NOTE: Performing query with unspecified labels in case empty labels list has been passed.
    if (targetLabelsNames.length < 1) {
      return this.runQuery(metric);
    }

    var targetLabels = "";

    // NOTE: Special symbols used to construct a query 
    let labelNameAndValueSeparator = "=";
    let labelsListDelimiter = ",";

    for (var labelName of targetLabelsNames) {
      let labelValue = labels.get(labelName);

      targetLabels += labelName + labelNameAndValueSeparator + JSON.stringify(labelValue);
      targetLabels += labelsListDelimiter;
    }

    let prometheusQuery = metric + this.METRIC_LABELS_LIST_START_SYMBOL + targetLabels + this.METRIC_LABELS_LIST_END_SYMBOL;
    return this.runQuery(prometheusQuery);
  }

  public getExistingRecordsInfo(): Observable<any> {
    // TODO: Add function that creates that kind of a query 
    let targetQuery = "sum without (instance)(rate(mongoose_duration_count[1y]))";
    return this.runQuery(targetQuery);
  }

  // MARK: - Private 

  // NOTE: Extracting payload from Prometheus' query response. 
  private extractResultPayload(rawMetric: any): any {
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
