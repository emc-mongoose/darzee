import { Component, OnInit, AfterViewChecked, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { MongooseRunRecord } from 'src/app/core/models/run-record.model';
import { Observable, Subject, merge, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-entry-node-selection',
  templateUrl: './entry-node-selection.component.html',
  styleUrls: ['./entry-node-selection.component.css']
})
export class EntryNodeSelectionComponent implements OnInit {

  @Input() mongooseRunRecord: MongooseRunRecord;
  @ViewChild('instance') typeheadInstance: NgbTypeahead;

  private existingNodesList: String[] = [];
  private currentEnteredText: string = ""
  focus$ = new Subject<string>();
  click$ = new Subject<string>();


  // public search: any; 

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.existingNodesList = this.mongooseRunRecord.getNodesList() || [];
    
  }


  search = (enteringText$: Observable<string>) => {
    if (this == undefined) { 
      return; 
    }
    const debouncedText$ = enteringText$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.typeheadInstance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => {
        this.currentEnteredText = term;
        return (term === '' ? this.existingNodesList
          : this.existingNodesList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10);
      })
    )
  }


  public onAddEntryNodeClicked(enteredEntryNodeAddress: string) {
    // NOTE: Removing whitespaces from string in case of accidental entering of them
    this.currentEnteredText = this.currentEnteredText.replace(" ", "");
    this.mongooseRunRecord.setEntryNodeAddress(this.currentEnteredText);
    this.activeModal.dismiss(enteredEntryNodeAddress);
  }
}
