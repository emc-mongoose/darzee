import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Constants } from 'src/app/common/constants';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, filter, tap, catchError } from 'rxjs/operators';
import { MongooseChartDataProvider } from '../../models/chart/mongoose-chart-interface/mongoose-chart-data-provider.interface';
import { MongooseMetric } from '../../models/chart/mongoose-metric.model';
import { PrometheusResponseParser } from './prometheus-response.parser';
import { HttpUtils } from 'src/app/common/HttpUtils';
import { LocalStorageService } from '../local-storage-service/local-storage.service';
import { MetricValueType } from '../../models/chart/mongoose-chart-interface/metric-value-type';
import { NumericMetricValueType } from '../../models/chart/mongoose-chart-interface/numeric-metric-value-type';
import { ContainerServerService } from '../container-server/container-server-service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})


export class PrometheusApiService implements MongooseChartDataProvider {

  private readonly DEFAULT_PROMETHEUS_IP: string = Constants.Configuration.PROMETHEUS_IP;
  private readonly LAST_CONCURRENCY_METRIC_NAME = "mongoose_concurrency_last";
  private readonly MEAN_CONCURRENCY_METRIC_NAME = "mongoose_concurrency_mean";

  private readonly MAX_LATENCY_METRIC_NAME = "mongoose_latency_max";
  private readonly MIN_LATENCY_METRIC_NAME = "mongoose_latency_min";
  private readonly MEAN_LATENCY_METRIC_NAME = "mongoose_latency_mean";

  private readonly MEAN_DURATION_METRIC_NAME = "mongoose_duration_mean";
  private readonly MIN_DURATION_METRIC_NAME = "mongoose_duration_min";
  private readonly MAX_DURATION_METRIC_NAME = "mongoose_duration_max";

  private readonly SUCCESS_OPERATIONS_RATE_MEAN_METRIC_NAME = "mongoose_success_op_rate_mean";
  private readonly SUCCESS_OPERATIONS_RATE_LAST_METRIC_NAME = "mongoose_success_op_rate_last";

  private readonly FAILED_OPERATIONS_RATE_MEAN_METRIC_NAME = "mongoose_failed_op_rate_mean";
  private readonly FAILED_OPERATIONS_RATE_LAST_METRIC_NAME = "mongoose_failed_op_rate_last";

  private readonly BYTE_RATE_MEAN_METRIC_NAME = "mongoose_byte_rate_mean";
  private readonly BYTE_RATE_LAST_METRIC_NAME = "mongoose_byte_rate_last";

  public readonly ELAPSED_TIME_VALUE_METRIC_NAME = "mongoose_elapsed_time_value";

  // NOTE: Symbols used for queryting Prometheus for value of metric with specific labels. They ...
  // ... are listed within the labels list. 
  readonly METRIC_LABELS_LIST_START_SYMBOL = "{";
  readonly METRIC_LABELS_LIST_END_SYMBOL = "}";

  readonly prometheusResponseParser: PrometheusResponseParser = new PrometheusResponseParser();

  private address: BehaviorSubject<string> = new BehaviorSubject<string>(this.DEFAULT_PROMETHEUS_IP);

  // MARK: - Lifecycle 

  constructor(private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private containerServerService: ContainerServerService) {
    this.setupPromtheusEntryNode();
  }

  // MARK: - MogooseChartDataProvider 

  /**
   * Prometheus healthcheck. 
   * @param prometheusAddress IP address of Prometheus server.
   * @returns true if Prometheus is available on @param prometheusAddress . 
   */
  public isAvailable(prometheusAddress: string = this.address.getValue()): Observable<boolean> {
    if (!HttpUtils.isIpAddressValid(prometheusAddress)) {
      return of(false);
    }
    const configurationEndpoint: string = 'status/config';
    return this.httpClient.get(`${this.getPrometheusApiBase(prometheusAddress)}${configurationEndpoint}`).pipe(
      map(
        (successfulResult: any) => {
          return true;
        }
      ),
      catchError(
        (errorResult: any) => {
          return of(false);
        }
      )
    )
  }

  public getElapsedTimeValue(periodInSeconds: number, loadStepId: string): Observable<MongooseMetric[]> {
    let metricName = this.ELAPSED_TIME_VALUE_METRIC_NAME;
    const latestValueTimePeriod: number = 0;

    let periodQueryComponent: string = undefined;
    if (periodInSeconds == latestValueTimePeriod) {
      // NOTE: Retrieving every found metric from specified period of years for Mongoose run elapsed time. 
      const periodOfYears: number = 1;
      periodQueryComponent = `[${periodOfYears}y]`;
    } else {
      periodQueryComponent = `[${periodInSeconds}s]`;

    }
    return this.runQuery(`${metricName}{load_step_id="${loadStepId}"}${periodQueryComponent}`).pipe(
      map(rawConcurrencyResponse => {
        return this.prometheusResponseParser.getMongooseMetricsArray(rawConcurrencyResponse);
      })
    )
  }

  /**
   * Sets @param prometheusHostIpAddress as a Prometheus' host for HTTP requests.
   * WARNING: Could be deprecated in case of implementing data retrieving from multiple Prometheus' nodes.
   */
  public setHostIpAddress(prometheusHostIpAddress: string) {
    this.address.next(prometheusHostIpAddress);
  }

  public getConcurrency(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumericMetricValueType): Observable<MongooseMetric[]> {
    let metricName: string = "";
    switch (numericMetricValueType) {
      case (NumericMetricValueType.LAST): {
        metricName = this.LAST_CONCURRENCY_METRIC_NAME;
        break;
      }
      case (NumericMetricValueType.MEAN): {
        metricName = this.MEAN_CONCURRENCY_METRIC_NAME;
        break;
      }
      default: {
        throw new Error(`Metric value type ${numericMetricValueType} hasn't been found for concurrency.`);
      }
    }

    return this.runQuery(`${metricName}{load_step_id="${loadStepId}"}[${periodInSeconds}s]`).pipe(
      map(rawConcurrencyResponse => {
        return this.prometheusResponseParser.getMongooseMetricsArray(rawConcurrencyResponse);
      })
    )
  }


  public getDuration(periodInSeconds: number, loadStepId: string, metricValueType: MetricValueType): Observable<MongooseMetric[]> {
    let metricName = this.MEAN_DURATION_METRIC_NAME;
    switch (metricValueType) {
      case (MetricValueType.MEAN): {
        metricName = this.MEAN_DURATION_METRIC_NAME;
        break;
      }
      case (MetricValueType.MAX): {
        metricName = this.MAX_DURATION_METRIC_NAME;
        break;
      }
      case (MetricValueType.MIN): {
        metricName = this.MIN_DURATION_METRIC_NAME;
        break;
      }
      default: {
        throw new Error(`Metric value type ${metricValueType} hasn't been found for duration.`);
      }
    }

    return this.runQuery(`${metricName}{load_step_id="${loadStepId}"}[${periodInSeconds}s]`).pipe(
      map(rawDurationResponse => {
        return this.prometheusResponseParser.getMongooseMetricsArray(rawDurationResponse);
      })
    );
  }

  public getAmountOfFailedOperations(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumericMetricValueType): Observable<MongooseMetric[]> {
    let metricName: string = "";
    switch (numericMetricValueType) {
      case (NumericMetricValueType.MEAN): {
        metricName = this.FAILED_OPERATIONS_RATE_MEAN_METRIC_NAME;
        break;
      }
      case (NumericMetricValueType.LAST): {
        metricName = this.FAILED_OPERATIONS_RATE_LAST_METRIC_NAME;
        break;
      }
      default: {
        throw new Error(`Metric value type ${numericMetricValueType} hasn't been found for failed operations.`);
      }
    }

    return this.runQuery(`${metricName}{load_step_id="${loadStepId}"}[${periodInSeconds}s]`).pipe(
      map(rawFailedlOperationsResponse => {
        return this.prometheusResponseParser.getMongooseMetricsArray(rawFailedlOperationsResponse);
      })
    )
  }

  public getAmountOfSuccessfulOperations(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumericMetricValueType): Observable<MongooseMetric[]> {
    let metricName: string = "";
    switch (numericMetricValueType) {
      case (NumericMetricValueType.MEAN): {
        metricName = this.SUCCESS_OPERATIONS_RATE_MEAN_METRIC_NAME;
        break;
      }
      case (NumericMetricValueType.LAST): {
        metricName = this.SUCCESS_OPERATIONS_RATE_LAST_METRIC_NAME;
        break;
      }
      default: {
        throw new Error(`Metric value type ${numericMetricValueType} hasn't been found for failed operations.`);
      }
    }

    return this.runQuery(`${metricName}{load_step_id="${loadStepId}"}[${periodInSeconds}s]`).pipe(
      map(rawSuccessfulOperationsResponse => {
        return this.prometheusResponseParser.getMongooseMetricsArray(rawSuccessfulOperationsResponse);
      })
    )
  }

  public getLatency(periodInSeconds: number, loadStepId: string, metricValueType: MetricValueType): Observable<MongooseMetric[]> {
    let metricName = this.MEAN_DURATION_METRIC_NAME;
    switch (metricValueType) {
      case (MetricValueType.MEAN): {
        metricName = this.MEAN_LATENCY_METRIC_NAME;
        break;
      }
      case (MetricValueType.MAX): {
        metricName = this.MAX_LATENCY_METRIC_NAME;
        break;
      }
      case (MetricValueType.MIN): {
        metricName = this.MIN_LATENCY_METRIC_NAME;
        break;
      }
      default: {
        throw new Error(`Metric value type ${metricValueType} hasn't been found for latency.`);
      }
    }
    return this.runQuery(`${metricName}{load_step_id="${loadStepId}"}[${periodInSeconds}s]`).pipe(
      map(rawMinLatencyQueryResponse => {
        return this.prometheusResponseParser.getMongooseMetricsArray(rawMinLatencyQueryResponse);
      })
    )
  }

  public getBandWidth(periodInSeconds: number, loadStepId: string, numericMetricValueType: NumericMetricValueType): Observable<MongooseMetric[]> {
    let metricName = this.BYTE_RATE_MEAN_METRIC_NAME;
    switch (numericMetricValueType) {
      case (NumericMetricValueType.MEAN): {
        metricName = this.BYTE_RATE_MEAN_METRIC_NAME;
        break;
      }
      case (NumericMetricValueType.LAST): {
        metricName = this.BYTE_RATE_LAST_METRIC_NAME;
        break;
      }
      default: {
        throw new Error(`Metric value type ${numericMetricValueType} hasn't been found for bandwidth.`);
      }
    }
    return this.runQuery(`${metricName}{load_step_id="${loadStepId}"}[${periodInSeconds}s]`).pipe(
      map(rawByteRateResponse => {
        return this.prometheusResponseParser.getMongooseMetricsArray(rawByteRateResponse);
      })
    )
  }

  // MARK: - Public 

  public runQuery(query: String): Observable<any> {
    let queryRequest = "query?query=";
    const currentPrometheusAddress: string = this.address.getValue();
    console.log(`[${PrometheusApiService.name}] Executing query ${queryRequest + query} aimed on address ${currentPrometheusAddress}`);
    return this.httpClient.get(this.getPrometheusApiBase(currentPrometheusAddress) + queryRequest + query, Constants.Http.JSON_CONTENT_TYPE).pipe(
      map((rawResponse: any) => this.extractResultPayload(rawResponse))
    );
  }

  public reloadPrometheus(): Observable<any> {
    let reloadEndpoint = "reload";
    return this.httpClient.post(`${Constants.Http.HTTP_PREFIX + Constants.Configuration.PROMETHEUS_IP}/-/${reloadEndpoint}`, Constants.Http.EMPTY_POST_REQUEST_HEADERS);
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
    let targetQuery = "sum%20without%20(instance)(rate(mongoose_duration_count[1y]))";
    return this.runQuery(targetQuery);
  }

  // MARK: - Private 

  /**
   * Extracrs payload of Prometheus raw response.
   * @param rawMetric raw response from Prometheys
   * @returns Array of labels and metrics.
   */
  private extractResultPayload(rawMetric: any): any {
    // NOTE: As for 21.03.2019, Ptometheus stores array of result for a query ...
    // ... within response's data.result field.
    let dataField = "data";
    let resultFieldTag = "result";

    let labelsOfMetric = rawMetric[dataField][resultFieldTag];
    if (labelsOfMetric == undefined) {
      let misleadingMsg = "Unable to fetch Mongoose Run List. Field 'data.result' doesn't exist.";
      console.error(misleadingMsg);
      throw new Error(misleadingMsg);
    }
    return labelsOfMetric;
  }

  /**
   * @returns current address of target Prmetheus' node.
   * WARNING: Could be deprecated in case of implementing data retrieving from multiple Prometheus nodes.
   */
  public getCurrentAddress(): Observable<string> {
    return this.address.asObservable();
  }


  /**
   * @param prometheusAddress Address for which API base will be returned.
   * @returns full Prometheus' API base. Format: http//prometheushost.com/api/v1/
   */
  private getPrometheusApiBase(prometheusAddress: string): string {
    const apiBasicEndpoint = "/api/v1/";
    const currentPrometheusAddress: string = this.address.getValue();
    if (currentPrometheusAddress.includes(Constants.Http.HTTP_PREFIX)) {
      return (currentPrometheusAddress + apiBasicEndpoint);
    }
    return (Constants.Http.HTTP_PREFIX + prometheusAddress + apiBasicEndpoint);
  }


  /**
   * Tries to retrieve Prometheus' entry node form both .env file and ...
   * ... local browser's storage.
   * @returns true if Prometheus has successully loaded.
   */
  public setupPromtheusEntryNode(): Observable<boolean> {

    var currentHostAddress: string = this.localStorageService.getPrometheusHostAddress();
    const emptyValue: string = "";
    if (currentHostAddress == emptyValue) {
      currentHostAddress = this.containerServerService.getContainerServicerAddressFromAddressLine();
    }
    // NOTE: Prometheus and UI runs within the same container. Thus, it's highly likely that...
    // ... they both have the same host address.
    // var currentHostAddress: string = this.containerServerService.getContainerServicerAddressFromAddressLine();
    console.log(`[${PrometheusApiService.name}] Current host address: ${currentHostAddress}`)

    const hostAddressContainsHttpPrefix: boolean = currentHostAddress.includes(Constants.Http.HTTP_PREFIX);
    if (hostAddressContainsHttpPrefix) {
      // NOTE: Pruning HTTP prefix for easier parsing.
      currentHostAddress = HttpUtils.pruneHttpPrefixFromAddress(currentHostAddress);
    }
    const ipAndPortDelimiter: string = ":";
    const ipAddressIndex: number = 0;

    var prometheusIp: string = currentHostAddress.split(ipAndPortDelimiter)[ipAddressIndex];

    const prometheusPortIndex: number = 1;
    var prometheusPort: string = currentHostAddress.split(ipAndPortDelimiter)[prometheusPortIndex];
    if (prometheusPort == undefined) {
      // NOTE: When user didn't specify Prometheus port, set the default one.
      prometheusPort = environment.prometheusPort;
    }

    // NOTE: Append IP address with default Prometheus port. 
    prometheusIp = `${prometheusIp}${ipAndPortDelimiter}${prometheusPort}`;

    console.log(`[${PrometheusApiService.name}] Trying to load Prometheus on ${prometheusIp}...`);

    return this.isAvailable(prometheusIp).pipe(
      map(
        (isDefaultAddressAvailable: boolean) => {
          if (isDefaultAddressAvailable) {
            console.log(`[${PrometheusApiService.name}] Host is successfully loaded on ${prometheusIp}.`);
            this.address.next(prometheusIp);
            // NOTE: Saving Prometheus' address into local storage in order to load it faster afterwards.
            this.localStorageService.savePrometheusHostAddress(prometheusIp);
            return isDefaultAddressAvailable;
          }
          console.log(`[${PrometheusApiService.name}] Host loading failure on ${prometheusIp}.`);
          const prometheusLocalStorageAddress: string = this.localStorageService.getPrometheusHostAddress();
          const isPrometheusLocalStorageIpValid: boolean = HttpUtils.isIpAddressValid(prometheusLocalStorageAddress);
          if (!isPrometheusLocalStorageIpValid) {
            console.error(`Unable to load Prometheus on address from local storage ${prometheusLocalStorageAddress} since it's not valid.`);
            return isPrometheusLocalStorageIpValid;
          }

          // NOTE: Prometheus' address is an observable and its subscriber - ...
          // ... - address handler - should reload it automatically.
          console.log(`[${PrometheusApiService.name}] Switching Prometheus' host to ${prometheusLocalStorageAddress}. Should be realoded automatically.`);
          this.address.next(prometheusLocalStorageAddress);
          const shouldReloadPrometheusAutomatically: boolean = true;
          return shouldReloadPrometheusAutomatically;
        }
      )
    );
  }

}
