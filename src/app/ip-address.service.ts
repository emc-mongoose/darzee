import { Injectable } from '@angular/core';
import { Observable, of, observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { IpAddress } from './ipAddress';
import { Config } from './config';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class IpAddressService {

  ipAddresses: IpAddress[] = [];
  config: Config = null;
  entryNode: String = '';

  public fileContent: string | ArrayBuffer = "";

  constructor(private http: HttpClient) { }

  getConfig(ip: string): any {
    return this.http.get('http://' + ip + '/config', httpOptions);
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
      if (ip == element.ip) {
        console.log('ID FOR DEL  ' + this.ipAddresses.indexOf(element));  //for debug
        this.ipAddresses.splice(this.ipAddresses.indexOf(element), 1);
      }
    });
  }

  // for http requests
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}
