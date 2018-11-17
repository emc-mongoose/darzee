import { Injectable } from '@angular/core';
import { Observable, of, observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { IpAddress } from './ipAddress';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

// export let ipAddresses: IpAddrs;

@Injectable({
  providedIn: 'root'
})
export class IpAddressService {

  ipAddresses: IpAddress[] = [];

  constructor(private http: HttpClient) {}

  getIpAddresses(): IpAddress[] {    
    return this.ipAddresses;
  }

  saveIpAddress(ip: string) {
    // alert(ip);
    const address = new IpAddress(ip);
    this.ipAddresses.push(address);
  }

  deleteIp(ip: string): void {
    // console.log('ip in service:' + ip);
    this.ipAddresses.forEach(element => {
      if (ip == element.ip){
        console.log('ID FOR DEL  ' + this.ipAddresses.indexOf(element));
        this.ipAddresses.splice(this.ipAddresses.indexOf(element), 1);  //  create reindex function
      }
    });
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}
