import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Constants } from 'src/app/common/constants';

@Injectable({
  providedIn: 'root'
})

// NOTE: Mongoose's CONTROL API is used for controlling execution of the Mongoose app itself. 
// Example: running with custom configurations, running with custom scenarios, etc. 

export class ControlApiService {

  constructor(private http: HttpClient) { }

  runMongoose(jsonConfiguration: string = "", javaScriptScenario: string = ""): any {

    // NOTE: Using JSON.stirngly(...) to pass Scenario as a HTTP parameter. It could contains multiple quotes, JSON.stringfy(...) handles it well. 
    javaScriptScenario = JSON.stringify(javaScriptScenario);

    let formData = new FormData(); 
    formData.append('defaults', jsonConfiguration);
    this.http.post('http://' + Constants.Configuration.MONGOOSE_PROXY_PASS + '/run?defaults=' + formData + "&scenario=" + javaScriptScenario, this.getHttpHeaderForJsonFile()).subscribe(
      error => alert("Unable to run Mongoose with current configuration. Reason: " + error)
    );
  }


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
