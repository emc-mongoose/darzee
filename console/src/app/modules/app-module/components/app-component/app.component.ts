import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { RunDuration } from '../../../../core/models/run-duration';
import { SharedLayoutService } from 'src/app/core/services/shared-layout-service/shared-layout.service';
import { MongooseNotification } from 'src/app/core/services/shared-layout-service/notification/mongoose-notification.model';
import { NotificationComponent } from 'src/app/core/services/shared-layout-service/notification/notifications.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Darzee';

  @ViewChild('notificationComponentTemplate', { read: ViewContainerRef }) notificationComponentTemplate: ViewContainerRef;

  private notificationComponentReferences: ComponentRef<any>[] = [];

  constructor(
    private resolver: ComponentFactoryResolver,
    private sharedLayoutService: SharedLayoutService
  ) {}

  ngOnInit() { 
    this.setUpNotifications();
   }

  private setUpNotifications(): void { 
    this.sharedLayoutService.getRecentlyAddedNotification().subscribe(
      (notification: MongooseNotification) => {
        this.notificationComponentTemplate.clear();
        const factory = this.resolver.resolveComponentFactory(NotificationComponent);
        const notificationComponentRef = this.notificationComponentTemplate.createComponent(factory)
        this.notificationComponentReferences.push(notificationComponentRef);
        notificationComponentRef.instance.notifications.push(notification)
      }
    )
  }
}
