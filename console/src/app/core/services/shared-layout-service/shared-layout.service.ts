import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { MongooseNotification } from './notification/mongoose-notification.model';

@Injectable({
  providedIn: 'root'
})
export class SharedLayoutService {

  private recentlyAddedNotification: Subject<MongooseNotification> = new Subject<MongooseNotification>();
  
  public addedNotification$ = this.recentlyAddedNotification.asObservable();
  // MARK: - Lifecycle

  constructor() { }

  // MARK: - Public

  public showNotification(notification: MongooseNotification): void { 
    console.log(`Notification has been created.`);
    this.recentlyAddedNotification.next(notification);
  }

  public getRecentlyAddedNotification(): Observable<MongooseNotification> { 
    return this.recentlyAddedNotification.asObservable();
  }
}
