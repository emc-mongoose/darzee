import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject, Observable, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prometheus-error',
  templateUrl: './prometheus-error.component.html',
  styleUrls: ['./prometheus-error.component.css']
})
export class PrometheusErrorComponent implements OnInit {


  @ViewChild(`prometheusAddressTypeheadInstance`) prometheusAddressTypeheadInstance: NgbTypeahead;

  public prometheusResourceLocation: string = "";
  public currentEnteredText: string = "";
  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();


  private possiblePrometheusNodesList: string[] = ['localhost:9090'];

  constructor() {
    let prometheusBaseAddress: string = environment.prometheusIp;
    let prometheusPort: string = environment.prometheusPort;
    this.prometheusResourceLocation = `${prometheusBaseAddress}:${prometheusPort}`;
  }

  ngOnInit() { }

  search = (enteringText$: Observable<string>) => {
    if (this == undefined) {
      return;
    }
    const debouncedText$ = enteringText$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.prometheusAddressTypeheadInstance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => {
        this.currentEnteredText = term;
        return (term === '' ? this.possiblePrometheusNodesList
          : this.possiblePrometheusNodesList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10);
      })
    )
  }

}
