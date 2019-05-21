import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MongooseRunRecord } from 'src/app/core/models/run-record.model';

@Component({
  selector: 'app-entry-node-selection',
  templateUrl: './entry-node-selection.component.html',
  styleUrls: ['./entry-node-selection.component.css']
})
export class EntryNodeSelectionComponent implements OnInit {

  @Input() mongooseRunRecord: MongooseRunRecord;
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
