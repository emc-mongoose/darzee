import { Component, OnInit, Input } from '@angular/core';
import { MongooseRunStatus } from '../core/mongoose-run-status';

@Component({
  selector: 'app-mongoose-run-status-icon',
  templateUrl: './mongoose-run-status-icon.component.html',
  styleUrls: ['./mongoose-run-status-icon.component.css']
})
export class MongooseRunStatusIconComponent implements OnInit {
  @Input() runStatus: MongooseRunStatus = MongooseRunStatus.Running;

  constructor() { }

  ngOnInit() {
    console.log("Run status: " + this.runStatus);
    console.log("")  
  }

    // MARK: - Public

    updateStatus(newStatus) { 
      this.runStatus = newStatus;
    }
}
