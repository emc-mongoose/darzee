import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MongooseRunStatus } from 'src/app/core/mongoose-run-status';

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
