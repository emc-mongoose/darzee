import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MongooseRunStatus } from '../core/mongoose-run-status';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-mongoose-run-status-icon',
  templateUrl: './mongoose-run-status-icon.component.html',
  styleUrls: ['./mongoose-run-status-icon.component.css']
})
export class MongooseRunStatusIconComponent implements OnInit {

  @Input() runStatus: MongooseRunStatus = MongooseRunStatus.Running;
  @ViewChild('resultsTag') resultsTag: ElementRef;
  
  constructor() { }

  ngOnInit() {  }

    // MARK: - Public

    updateStatus(newStatus) { 
      this.runStatus = newStatus;
    }

    isRunningCompleted(): boolean { 
      return (this.runStatus == MongooseRunStatus.Finished);
    }
}
