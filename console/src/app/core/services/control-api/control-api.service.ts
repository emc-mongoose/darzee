import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Constants } from 'src/app/common/constants';
import { MongooseApi } from '../mongoose-api-models/MongooseApi.model';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

// NOTE: Mongoose's CONTROL API is used for controlling execution of the Mongoose app itself. 
// Example: running with custom configurations, running with custom scenarios, etc. 

export class ControlApiService {

  mongooseSlaveNodes: String[] = [];
  private mongooseHostIp = Constants.Configuration.MONGOOSE_HOST_IP;

  constructor(private http: HttpClient) {
    console.log(`Is environment prod: ${environment.production}`)
    console.log(`Mongoose address: ${Constants.Http.HTTP_PREFIX}${environment.mongooseIp}:${environment.mongoosePort}`)
    this.mongooseHostIp = `${Constants.Http.HTTP_PREFIX}${environment.mongooseIp}:9999`;
    this.getMongooseConfiguration(this.mongooseHostIp).subscribe(
      result => { 
        console.log(`Mongoose configuration has responded with result: ${JSON.stringify(result)}`);
      },
      error => { 
        console.error(`Unable to get Mongoose configuration from source ${this.mongooseHostIp}. Details: ${JSON.stringify(error)}`);
      }
    );
  }

  // MARK: - Public

  public getMongooseIp(): string { 
    return this.mongooseHostIp;
  }

  public runMongoose(mongooseJsonConfiguration: Object, javaScriptScenario: String = ""): Observable<any> {

    // NOTE: Using JSON.stirngly(...) to pass Scenario as a HTTP parameter. It could contains multiple quotes, JSON.stringfy(...) handles it well. 
    javaScriptScenario = JSON.stringify(javaScriptScenario);

    let formData = new FormData();
    formData.append('defaults', JSON.stringify(mongooseJsonConfiguration));

    return this.http.post(Constants.Http.HTTP_PREFIX + this.mongooseHostIp + '/run?defaults=' + formData + "&scenario=" + javaScriptScenario, this.getHttpHeadersForMongooseRun(), { observe: "response" }).pipe(
      map(runResponse => {
        let runId = runResponse.headers.get(MongooseApi.Headers.ETAG);
        return runId;
      }));
  }

  // NOTE: Returning Mongoose configuration as JSON 
  public getMongooseConfiguration(mongooseAddress: string): Observable<any> {
    let configEndpoint = MongooseApi.Config.CONFIG;

    var mongooseConfigurationHeaders = new HttpHeaders();
    mongooseConfigurationHeaders.append('Accept', 'application/json');

    return this.http.get(mongooseAddress + configEndpoint, {headers: mongooseConfigurationHeaders});
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
