import { Injectable } from '@angular/core';
import { Observable, of, observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { IpAddress } from './ipAddress';
import { NodeConfig } from './nodeConfig';
import { Constants } from 'src/app/common/constants';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class IpAddressService {



  ipAddresses: IpAddress[] = [];
  nodeConfig: NodeConfig = null;
  entryNode: String = '';

  public fileContent: string | ArrayBuffer = '';

  constructor(private http: HttpClient) { }

  getConfig(ip: string): any {
    return this.http.get('http://' + ip + '/config', httpOptions)
      .pipe(catchError(this.handleError));
    // return this.http.get('http://localhost:9999/config', httpOptions);  // for easy debug
  }

  getIpAddresses(): IpAddress[] {
    return this.ipAddresses;
  }


  public postNewConfiguration(jsonConfiguration: string): any {
    let formData = new FormData(); 
    formData.append('defaults', jsonConfiguration);
    this.http.post('http://' + Constants.Configuration.MONGOOSE_PROXY_PASS + '/run?defaults=' + formData, this.getHttpHeadersForRun()).subscribe(
      error => alert("Unable to run Mongoose with current configuration. Reason: " + error)
    );
  }


  private getHttpHeadersForRun(): HttpHeaders { 
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


  saveIpAddress(ip: string) {
    const address = new IpAddress(ip);
    for (let i = 0; i < this.ipAddresses.length; ++i) {
      if (this.ipAddresses[i].ip === ip) {
        console.log('Ip already in list!');
        alert('This IP already in list!');
        return;
      }
    }
    this.ipAddresses.push(address);
  }

  deleteIp(id: number): void {
    // console.log('ID FOR DEL  ' + id + ' length: ' + this.ipAddresses.length);  // for debug
    this.ipAddresses.splice(id, 1);

    let countId = 0;
    for (let i = 0; i < this.ipAddresses.length; ++i) {
      this.ipAddresses[i].id = countId;
      countId++;
    }
    IpAddress.identifier = this.ipAddresses.length;

  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occured:', error.error.message);
    } else {
      console.error(
        `Returned code ${error.status}, ` +
        `body: ${error.error}`);
    }
    alert('Something went wrong!');
    return throwError('Something went wrong.');
  }

}
