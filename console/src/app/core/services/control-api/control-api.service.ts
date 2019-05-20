import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Constants } from 'src/app/common/constants';
import { MongooseApi } from '../mongoose-api-models/MongooseApi.model';
import { Observable, of } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MongooseRunStatus } from '../../models/mongoose-run-status';

@Injectable({
  providedIn: 'root'
})

// NOTE: Mongoose's CONTROL API is used for controlling execution of the Mongoose app itself. 
// Example: running with custom configurations, running with custom scenarios, etc. 

export class ControlApiService {

  mongooseSlaveNodes: String[] = [];
  private mongooseHostIp = Constants.Configuration.MONGOOSE_HOST_IP;

  constructor(private http: HttpClient) {
    this.mongooseHostIp = `${Constants.Http.HTTP_PREFIX}${environment.mongooseIp}:` + `${environment.mongoosePort}`;
  }

  // MARK: - Public

  public getMongooseIp(): string {
    return this.mongooseHostIp;
  }

  public runMongoose(entryNodeAddress: string, mongooseJsonConfiguration: Object = "", javaScriptScenario: String = ""): Observable<any> {

    // NOTE: Using JSON.stirngly(...) to pass Scenario as a HTTP parameter. It could contains multiple quotes, JSON.stringfy(...) handles it well. 

    let configurationFormData = this.getFormDataArgumentsForMongooseRun(mongooseJsonConfiguration, javaScriptScenario);


    return this.http.post(`${Constants.Http.HTTP_PREFIX}${entryNodeAddress}` + "/run", configurationFormData, { observe: "response" }).pipe(
      map(runResponse => {
        let runId = runResponse.headers.get(MongooseApi.Headers.ETAG);
        return runId;
      }));
  }

  public terminateMongooseRun(runId: string): Observable<string> {
    const terminationHeaders = {
      // NOTE: Termination is completed using'If-Match' header. 
      // Matching by run ID.
      'If-Match': `${runId}`
    }

    const terminationRequestOptions = {
      headers: new HttpHeaders(terminationHeaders),
      observe: 'response' as 'body'
    }

    return this.http.delete(`${this.mongooseHostIp}/${MongooseApi.RunApi.RUN_ENDPOINT}`, terminationRequestOptions).pipe(
      map((response: any) => {
        if (response.status == Constants.HttpStatus.OK) {
          return `Run ${runId} has been successfully terminated.`;
        }
        return `Run ${runId} hasn't been terminated. Detauls: ${response}`;
      })
    );
  }

  // NOTE: Returning Mongoose configuration as JSON 
  public getMongooseConfiguration(mongooseAddress: string): Observable<any> {
    let configEndpoint = MongooseApi.Config.CONFIG;

    var mongooseConfigurationHeaders = new HttpHeaders();
    mongooseConfigurationHeaders.append('Accept', 'application/json');

    return this.http.get(mongooseAddress + configEndpoint, { headers: mongooseConfigurationHeaders });
  }

  public getStatusForMongooseRun(runId: string): Observable<MongooseRunStatus> {

    const requestRunStatusHeaders = {
      // NOTE: 'If-Match' header should contain Mongoose run ID, NOT load step ID.
      'If-Match': `${runId}`
    }

    const runStatusRequestOptions = {
      headers: new HttpHeaders(requestRunStatusHeaders),
      observe: 'response' as 'body'
    }

    return this.http.get(`${this.mongooseHostIp}/${MongooseApi.RunApi.RUN_ENDPOINT}`, runStatusRequestOptions).pipe(
      map((runStatusResponse: any) => {
        let responseStatusCode = runStatusResponse.status;

        if (responseStatusCode == undefined) {
          return MongooseRunStatus.Unavailable;
        }

        let isRunActive: boolean = (responseStatusCode == Constants.HttpStatus.OK);
        return isRunActive ? MongooseRunStatus.Running : MongooseRunStatus.Finished;
      })
    )
  }


  // MARK: - Private


  // NOTE: Mongoose run accepts parameters as form data (configuration file, scenario file, etc.). The function ...
  // ... adds the parameters into FormData object.
  private getFormDataArgumentsForMongooseRun(mongooseRunConfiguration: Object, mongooseRunScenario: Object): FormData {
    const emptyValue = "";

    let configurationFormData = new FormData();
    if (mongooseRunConfiguration != emptyValue) {
      let mongooseConfigurationBlob = new Blob([JSON.stringify(mongooseRunConfiguration)], { type: "application/json" });
      configurationFormData.append('defaults', mongooseConfigurationBlob);
    }

    if (mongooseRunScenario != emptyValue) {
      let mongooseRunScenarioBlob = new Blob([JSON.stringify(mongooseRunScenario)], { type: "text/plain" });
      configurationFormData.append('scenario', mongooseRunScenarioBlob);
    }

    return configurationFormData;
  }

  private getHttpHeaderForJsonFile(): HttpHeaders {
    var httpHeadersForMongooseRun = new HttpHeaders();
    httpHeadersForMongooseRun.append('Accept', 'application/json');
    const eTag = this.getEtagForRun();
    httpHeadersForMongooseRun.append('If-Match', eTag);
    return httpHeadersForMongooseRun;
  }

  private getHttpHeadersForMongooseRun(): HttpHeaders {
    let httpHeadersForMongooseRun = new HttpHeaders();
    httpHeadersForMongooseRun.append('Accept', '*/*');
    return httpHeadersForMongooseRun;
  }

  // NOTE: ETAG is HEX representation of configuration start time in milliseconds 
  private getEtagForRun(): string {
    const currentDateTime = Date.now();
    const hexNumericSystemBase = 16;
    return currentDateTime.toString(hexNumericSystemBase);
  }

}
