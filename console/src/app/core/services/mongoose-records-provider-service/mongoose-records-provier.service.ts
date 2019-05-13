import { Injectable } from '@angular/core';
import { MongooseRunRecord } from '../../models/mongoose-run-record/run-record.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MongooseRecordsProvierService {

  public mongooseRunRecords$: BehaviorSubject<MongooseRunRecord[]> = new BehaviorSubject<MongooseRunRecord[]>([]);

  private mongooseRunRecord: MongooseRunRecord[] = []


  constructor() { }

  public getMogooseRunRecords$(): Observable<MongooseRunRecord[]> { 
    return this.mongooseRunRecords$.asObservable(); 
  }
}
