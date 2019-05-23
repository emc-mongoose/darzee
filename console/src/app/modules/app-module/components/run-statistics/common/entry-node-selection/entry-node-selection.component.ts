import { Component, OnInit, AfterViewChecked, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { MongooseRunRecord } from 'src/app/core/models/run-record.model';
import { Observable, Subject, merge, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { MongooseDataSharedServiceService } from 'src/app/core/services/mongoose-data-shared-service/mongoose-data-shared-service.service';
import { MongooseRunNode } from 'src/app/core/models/mongoose-run-node.model';
import { MonitoringApiService } from 'src/app/core/services/monitoring-api/monitoring-api.service';
import { MongooseApi } from 'src/app/core/services/mongoose-api-models/MongooseApi.model';

@Component({
  selector: 'app-entry-node-selection',
  templateUrl: './entry-node-selection.component.html',
  styleUrls: ['./entry-node-selection.component.css']
})
export class EntryNodeSelectionComponent implements OnInit {

  @Input() mongooseRunRecord: MongooseRunRecord;
  @ViewChild('instance') typeheadInstance: NgbTypeahead;

  public errorMessage: string = undefined;

  private errorMessage$: Subject<string> = new Subject<string>();

  private existingNodesList: String[] = [];
  private currentEnteredText: string = ""
  private activeSubscriptions: Subscription = new Subscription();

  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();


  // public search: any; 

  constructor(public activeModal: NgbActiveModal,
    private mongooseDataSharedServiceService: MongooseDataSharedServiceService,
    private monitoringApiService: MonitoringApiService) {
    this.activeSubscriptions.add(
      this.mongooseDataSharedServiceService.getAvailableRunNodes().subscribe(
        (availableRunNodes: MongooseRunNode[]) => {
          let availableRunNodeAddressess: String[] = [];
          availableRunNodes.forEach((runNode: MongooseRunNode) => {
            availableRunNodeAddressess.push(runNode.getResourceLocation());
          });
          this.existingNodesList = availableRunNodeAddressess;
        }
      )
    )
  }

  ngOnInit() {
    this.errorMessage$.subscribe((message) => this.errorMessage = message);
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
   
    let testLogNameEndpoint = MongooseApi.Config.CONFIG;
    this.activeSubscriptions.add(
      this.monitoringApiService.getLog(enteredEntryNodeAddress, this.mongooseRunRecord.getLoadStepId(), testLogNameEndpoint).subscribe(
        successResult => {
          this.activeModal.dismiss(enteredEntryNodeAddress);
        },
        error => {
          this.errorMessage$.next(`Entry node ${enteredEntryNodeAddress} is not correct for load step ID ${this.mongooseRunRecord.getLoadStepId()}`)
        }
      )
    )
  }
}
