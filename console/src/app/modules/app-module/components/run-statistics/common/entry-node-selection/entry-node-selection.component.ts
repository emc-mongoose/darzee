import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { MongooseRunRecord } from 'src/app/core/models/run-record.model';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-entry-node-selection',
  templateUrl: './entry-node-selection.component.html',
  styleUrls: ['./entry-node-selection.component.css']
})
export class EntryNodeSelectionComponent implements OnInit {

  @Input() mongooseRunRecord: MongooseRunRecord;
  @ViewChild('instance') instance: NgbTypeahead;

  private existingNodesList = [];
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  
  constructor(public activeModal: NgbActiveModal) { 
  }

  ngOnInit() {
    this.existingNodesList = this.mongooseRunRecord.getNodesList();

   }

   search = (enteringText$: Observable<string>) => { 
    const debouncedText$ = enteringText$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.existingNodesList
        : this.existingNodesList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
   }
}
