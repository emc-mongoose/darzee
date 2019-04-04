import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Constants } from 'src/app/common/constants';
import { MongooseApi } from '../mongoose-api-models/MongooseApi.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

// NOTE: Mongoose's CONTROL API is used for controlling execution of the Mongoose app itself. 
// Example: running with custom configurations, running with custom scenarios, etc. 

export class ControlApiService {

  mongooseSlaveNodes: String[] = [];

  constructor(private http: HttpClient) {
    this.getMongooseConfiguration(Constants.Configuration.MONGOOSE_HOST_IP);
  }

  // MARK: - Public

  public runMongoose(mongooseJsonConfiguration: Object, javaScriptScenario: String = ""): Observable<any> {

    // NOTE: Using JSON.stirngly(...) to pass Scenario as a HTTP parameter. It could contains multiple quotes, JSON.stringfy(...) handles it well. 
    javaScriptScenario = JSON.stringify(javaScriptScenario);

    let formData = new FormData();
    formData.append('defaults', JSON.stringify(mongooseJsonConfiguration));

    return this.http.post(Constants.Http.HTTP_PREFIX + Constants.Configuration.MONGOOSE_HOST_IP + '/run?defaults=' + formData + "&scenario=" + javaScriptScenario, this.getHttpHeadersForMongooseRun(), { observe: "response" }).pipe(
      map(runResponse => {
        let runId = runResponse.headers.get(MongooseApi.Headers.ETAG);
        return runId;
      }));
  }

  // NOTE: Returning Mongoose configuration as JSON 
  public getMongooseConfiguration(mongooseHostIp: string): any {
    let configEndpoint = MongooseApi.Config.CONFIG;
    return this.http.get(Constants.Http.HTTP_PREFIX + mongooseHostIp + configEndpoint, Constants.Http.JSON_CONTENT_TYPE);
  }


  // MARK: - Private

  private getHttpHeaderForJsonFile(): HttpHeaders {
    var httpHeadersForMongooseRun = new HttpHeaders();
    httpHeadersForMongooseRun.append('Accept', 'application/json');
    const eTag = this.getEtagForRun();
    httpHeadersForMongooseRun.append('If-Match', eTag);
    return httpHeadersForMongooseRun;
  }

  private getHttpHeadersForMongooseRun(): HttpHeaders {
    let httpHeadersForMongooseRun = new HttpHeaders();
    httpHeadersForMongooseRun.append('Content-Type', 'multipart/form-data');
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
