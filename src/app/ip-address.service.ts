import { Injectable } from '@angular/core';
import { Observable, of, observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { IpAddress } from './ipAddress';
import { NodeConfig } from './nodeConfig';

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

  saveIpAddress(ip: string) {
    const address = new IpAddress(ip);
    this.ipAddresses.push(address);
  }

  deleteIp(ip: string): void {
    this.ipAddresses.forEach(element => {
      if (ip === element.ip) {
        console.log('ID FOR DEL  ' + this.ipAddresses.indexOf(element));  // for debug
        this.ipAddresses.splice(this.ipAddresses.indexOf(element), 1);
      }
    });
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
