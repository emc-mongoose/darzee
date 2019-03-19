import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Constants } from 'src/app/common/constants';

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

  runMongoose(jsonConfiguration: Object, javaScriptScenario: String = ""): any {
    // NOTE: Using JSON.stirngly(...) to pass Scenario as a HTTP parameter. It could contains multiple quotes, JSON.stringfy(...) handles it well. 
    javaScriptScenario = JSON.stringify(javaScriptScenario);

    let formData = new FormData();
    formData.append('defaults', jsonConfiguration.toString());

    this.http.post(Constants.Http.HTTP_PREFIX + Constants.Configuration.MONGOOSE_HOST_IP + '/run?defaults=' + formData + "&scenario=" + javaScriptScenario, this.getHttpHeaderForJsonFile()).subscribe(
      error => {
        alert("Unable to run Mongoose. Reason: " + error);
      });
  }

  // NOTE: Returning Mongoose configuration as JSON 
  getMongooseConfiguration(mongooseHostIp: string): any {
    const configEndpoint = "/config";
    return this.http.get(Constants.Http.HTTP_PREFIX + mongooseHostIp + configEndpoint, Constants.Http.JSON_CONTENT_TYPE);
  }


  // MARK: - Private

  private getHttpHeaderForJsonFile(): HttpHeaders {
    const httpHeadersForMongooseRun = new HttpHeaders();
    httpHeadersForMongooseRun.append('Accept', 'application/json');
    const eTag = this.getEtagForRun();
    httpHeadersForMongooseRun.append('If-Match', eTag);
    return httpHeadersForMongooseRun;
  }

  // NOTE: ETAG is HEX representation of configuration start time in milliseconds 
  private getEtagForRun(): string {
    const currentDateTime = Date.now();
    const hexNumericSystemBase = 16;
    return currentDateTime.toString(hexNumericSystemBase);
  }

}
