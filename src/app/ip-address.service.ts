import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { IpAddress } from './ipAddress';
import { IPADDRESSES } from './mock-ipAddresses';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class IpAddressService {

  public fileContent: string | ArrayBuffer = "";

  constructor(
    private http: HttpClient,
    ) { }

  getIpAddresses(): Observable<IpAddress[]> {

    return of(IPADDRESSES);
  }

  connectNode(): void {
    // this.http.
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}
