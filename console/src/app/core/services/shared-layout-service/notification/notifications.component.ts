import { Component, OnInit } from '@angular/core';
import { SharedLayoutService } from '../shared-layout.service';
import { MongooseNotification } from './mongoose-notification.model';

@Component({
  selector: 'mongoose-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationComponent {
  
  private _notes: MongooseNotification[];

    constructor(private sharedLayoutService: SharedLayoutService) {
        console.log(`NotificationComponent has been created.`);
        this._notes = new Array<MongooseNotification>();

        this.sharedLayoutService.addedNotification$.subscribe(
            (notification: MongooseNotification) => {
            console.log(`Notification has been shown up.`)
            this._notes.push(notification);
            setTimeout(() => { this.hide.bind(this)(notification) }, 3000);
        });
    }

    private hide(note) {
        let index = this._notes.indexOf(note);

        if (index >= 0) {
            this._notes.splice(index, 1);
        }
    }

}
