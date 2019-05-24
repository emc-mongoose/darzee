import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject, Observable, merge, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { MongooseDataSharedServiceService } from 'src/app/core/services/mongoose-data-shared-service/mongoose-data-shared-service.service';
import { MongooseRunNode } from 'src/app/core/models/mongoose-run-node.model';
import { PrometheusApiService } from 'src/app/core/services/prometheus-api/prometheus-api.service';
import { HttpUtils } from 'src/app/common/HttpUtils';

@Component({
  selector: 'app-prometheus-error',
  templateUrl: './prometheus-error.component.html',
  styleUrls: ['./prometheus-error.component.css']
})
export class PrometheusErrorComponent implements OnInit {

  /**
   * @param prometheusAddressTypeheadInstance references to input field for Prometheus IP address.
   * @param onPrometheusLoad emits an event once Prometheus has been loaded.
   */
  @ViewChild(`prometheusAddressTypeheadInstance`) prometheusAddressTypeheadInstance: NgbTypeahead;
  @Output() onPrometheusLoad = new EventEmitter();


  private readonly DEFAULT_PROMETHEUS_NODE_ADDRESS = "localhost";
  private readonly DEFAULT_PROMETHEUS_NODE_PORT = "9090";

  public prometheusResourceLocation: string = "";
  public currentEnteredText: string = "";
  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();

  private possiblePrometheusNodesList: string[] = [];
  private activeSubscriptions: Subscription = new Subscription();

  private isLoadingInProgress: boolean = false;

  constructor(private mongooseDataSharedServiceService: MongooseDataSharedServiceService,
    private prometheusApiService: PrometheusApiService) {
    let prometheusBaseAddress: string = environment.prometheusIp;
    let prometheusPort: string = environment.prometheusPort;
    this.prometheusResourceLocation = `${prometheusBaseAddress}:${prometheusPort}`;
  }

  ngOnInit() {
    this.subscribeToPossiblePrometheusRunNodes();
  }

  /**
   * Searches for possible Prometheus node while user is typing.
   */
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

  public onRetryBtnClicked() {
    let enteredPrometheusAddress: string = this.currentEnteredText;
    if (!HttpUtils.isIpAddressValid(enteredPrometheusAddress)) { 
      alert(`IP address ${enteredPrometheusAddress} is not valid.`);
      return;
    }
    this.tryToLoadPrometheus(enteredPrometheusAddress);
  }

  public shouldDisplayLoadBtn(): boolean {
    return this.isLoadingInProgress;
  }

  // MARK: - Private 

  private subscribeToPossiblePrometheusRunNodes() {
    this.activeSubscriptions.add(
      this.mongooseDataSharedServiceService.getAvailableRunNodes().subscribe(
        (availableRunNodes: MongooseRunNode[]) => {
          let availableRunNodeAddressess: String[] = [];
          availableRunNodes.forEach((runNode: MongooseRunNode) => {
            availableRunNodeAddressess.push(runNode.getResourceLocation());
          });
          // NODE: Adding default Prometheus address.
          let defaultPrometheusAddress = `${this.DEFAULT_PROMETHEUS_NODE_ADDRESS}:${this.DEFAULT_PROMETHEUS_NODE_PORT}`;
          availableRunNodeAddressess.push(defaultPrometheusAddress);
          this.possiblePrometheusNodesList = availableRunNodeAddressess as string[];
        }
      )
    )
  }

  /**
   * Reload Prometheus on provided address.
   * @param prometheusAddress IP address of Prometheus.
   */
  private tryToLoadPrometheus(prometheusAddress: string) {
    this.isLoadingInProgress = true;
    this.activeSubscriptions.add(
      this.prometheusApiService.isAvailable(prometheusAddress).subscribe(
        (isPrometheusAvailable: boolean) => {
          this.isLoadingInProgress = false;
          if (!isPrometheusAvailable) { 
            alert(`Prometheus is not available on ${prometheusAddress}`);
            this.prometheusResourceLocation = prometheusAddress;
            return;
          }
          this.onPrometheusLoad.emit();
        }
      )
    )
  }

}
