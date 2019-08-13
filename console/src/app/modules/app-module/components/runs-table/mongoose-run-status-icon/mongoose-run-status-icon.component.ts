import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MongooseRunStatus } from 'src/app/core/models/mongoose-run-status';

@Component({
  selector: 'app-mongoose-run-status-icon',
  templateUrl: './mongoose-run-status-icon.component.html',
  styleUrls: ['./mongoose-run-status-icon.component.css']
})

export class MongooseRunStatusIconComponent implements OnInit, OnDestroy {

  // NOTE: We're using bootstrap buttons style. See: https://www.w3schools.com/bootstrap/bootstrap_buttons.asp 
  private readonly BTN_SUCCESS_TAG = 'btn-success';
  private readonly BTN_WARNING_TAG = 'btn-warning';
  private readonly BTN_UNAVAILABLE_TAG = 'btn-unavailable';

  private readonly TAG_UNAVAILABLE = 'unavailableTag';
  private readonly TAG_DETAILS = 'detailsTag';
  private readonly TAG_RESULTS = 'resultsTag';

  @Input() runStatus: MongooseRunStatus = MongooseRunStatus.Running;
  @ViewChild('resultsTag') resultsTag: ElementRef;

  constructor() { }

  ngOnInit() { }

  ngOnDestroy(): void {  }
  // MARK: - Public

  public updateStatus(newStatus) {
    this.runStatus = newStatus;
    this.ngOnInit();
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
    return this.BTN_UNAVAILABLE_TAG;
  }

  public getStatusTag(): String {
    switch (this.runStatus) {
      case MongooseRunStatus.Unavailable: {
        return this.TAG_UNAVAILABLE;
      }
      case MongooseRunStatus.Running: {
        return this.TAG_DETAILS;
      }
      case MongooseRunStatus.Finished: {
        return this.TAG_RESULTS;
      }
      default: {
        return this.TAG_UNAVAILABLE;
      }
    }
  }

  // MARK: - Private
  private isRunningCompleted(): boolean {
    return (this.runStatus == MongooseRunStatus.Finished);
  }
}
