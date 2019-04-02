import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MongooseRunStatus } from 'src/app/core/mongoose-run-status';

@Component({
  selector: 'app-mongoose-run-status-icon',
  templateUrl: './mongoose-run-status-icon.component.html',
  styleUrls: ['./mongoose-run-status-icon.component.css']
})

export class MongooseRunStatusIconComponent implements OnInit {

  // NOTE: We're using bootstrap buttons style. See: https://www.w3schools.com/bootstrap/bootstrap_buttons.asp 
  private readonly BTN_SUCCESS_TAG = 'btn-success';
  private readonly BTN_WARNING_TAG = 'btn-warning';
  private readonly BTN_UNAVAILABLE_TAG = '';

  @Input() runStatus: MongooseRunStatus = MongooseRunStatus.Running;
  @ViewChild('resultsTag') resultsTag: ElementRef;

  constructor() { }

  ngOnInit() { }

  // MARK: - Public

  updateStatus(newStatus) {
    this.runStatus = newStatus;
  }



  public getMongooseRunIconClass(): String { 
    if (this.isRunningCompleted()) { 
      return this.BTN_SUCCESS_TAG;
    }
    switch (this.runStatus) { 
      case MongooseRunStatus.Running: { 
        return this.BTN_WARNING_TAG;
      }
      case MongooseRunStatus.Unavailable: { 
        return this.BTN_UNAVAILABLE_TAG;
      }
    }
  }

  onStatusButtonClicked() {
    console.log("status btn clicked");
  }

  getStatusTag(): String {
    let actualTag = 'unavailableTag';
    switch (this.runStatus) {
      case MongooseRunStatus.Unavailable: {
        actualTag = 'unavailableTag';
        break;
      }
      case MongooseRunStatus.Running: {
        actualTag = 'detailsTag';
        break;
      }
      case MongooseRunStatus.Finished: {
        actualTag = 'resultsTag';
      }
      default: {
        actualTag = 'unavailableTag';
      }
    }
    return actualTag;
  }

  // MARK: - Private
  private isRunningCompleted(): boolean {
    return (this.runStatus == MongooseRunStatus.Finished);
  }
}
