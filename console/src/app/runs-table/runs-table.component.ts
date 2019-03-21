import { Component, OnInit, Input } from '@angular/core';
import { MongooseRunRecord } from '../core/models/run-record.model';
import { Router } from '@angular/router';
import { RoutesList } from '../Routing/routes-list';


@Component({
  selector: 'app-runs-table',
  templateUrl: './runs-table.component.html',
  styleUrls: ['./runs-table.component.css'],
  
})

export class RunsTableComponent implements OnInit {

  readonly EMPTY_FIELD_DEFAULT_TAG = "-";

  @Input() mongooseRunRecords: MongooseRunRecord[];  

  readonly columnHeaders = [
    "Status",
    "Start time",
    "Nodes",
    "Duration",
    "Comment"
  ];

  constructor(private router: Router) { }

  // MARK: - Lifecycle 

  ngOnInit() {  }

  // MARK: - Public 

  onRunStatusIconClicked(mongooseRunRecord: MongooseRunRecord) { 
    this.router.navigate(['/' + RoutesList.RUN_STATISTICS, mongooseRunRecord.getIdentifier()]);
  }

  getNodesList(record: MongooseRunRecord): String[] { 
    var result: String[] = []; 
    if (record.getNodesList().length == 0) { 
      result.push(this.EMPTY_FIELD_DEFAULT_TAG);
      return result;
    }
    return record.getNodesList();
  }

  getComment(record: MongooseRunRecord): String { 
    var comment = record.getComment(); 
    let emptyValue = ""; 
    let isCommentEmpty = (comment === emptyValue);

    return (isCommentEmpty ? this.EMPTY_FIELD_DEFAULT_TAG : comment);
  }

}
