import { Component, OnInit } from '@angular/core';
import { SharedLayoutService } from '../shared-layout.service';
import { MongooseNotification } from './mongoose-notification.model';

@Component({
    selector: 'mongoose-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationComponent {

    private readonly NOTIFICATION_LIFETIME_MS: number = 3000;

    /**
     * @param notifications currently active notifications.
     */
    private notifications: MongooseNotification[];

    constructor(private sharedLayoutService: SharedLayoutService) {
        this.notifications = new Array<MongooseNotification>();

        this.sharedLayoutService.addedNotification$.subscribe(
            (notification: MongooseNotification) => {
                this.notifications.push(notification);
                setTimeout(() => { this.hide.bind(this)(notification) }, this.NOTIFICATION_LIFETIME_MS);
            });
    }

    /**
     * Responsible for removing @param notification from the UI.
     */
    private hide(notification: MongooseNotification): void {
        let index = this.notifications.indexOf(notification);

        if (index >= 0) {
            this.notifications.splice(index, 1);
        }
    }

}
