import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// NOTE: Mongoose's CONTROL API is used for controlling execution of the Mongoose app itself. 
// Example: running with custom configurations, running with custom scenarios, etc. 

export class ControlApiService {

  mongooseSlaveNodes: String[] = [];

  mongooseConfiguration: Object; 

  readonly HTTP_PREFIX = "http://";
  readonly JSON_CONTENT_TYPE = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
    this.getMongooseConfiguration(Constants.Configuration.MONGOOSE_HOST_IP);
   }

  // MARK: - Public

  runMongoose(jsonConfiguration: Object = "", javaScriptScenario: String = ""): any {
    // NOTE: Using JSON.stirngly(...) to pass Scenario as a HTTP parameter. It could contains multiple quotes, JSON.stringfy(...) handles it well. 
    javaScriptScenario = JSON.stringify(javaScriptScenario);

    let formData = new FormData(); 
    formData.append('defaults', jsonConfiguration.toString());

    this.http.post(this.HTTP_PREFIX + Constants.Configuration.MONGOOSE_HOST_IP + '/run?defaults=' + formData + "&scenario=" + javaScriptScenario, this.getHttpHeaderForJsonFile()).subscribe(
      error => {
        alert("Unable to run Mongoose. Reason: " + error);
      });
  }

  // NOTE: Returning Mongoose configuration as JSON 
  getMongooseConfiguration(mongooseHostIp: string): any { 
    const configEndpoint = "/config";
    return this.http.get(this.HTTP_PREFIX + mongooseHostIp + configEndpoint, this.JSON_CONTENT_TYPE);
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
