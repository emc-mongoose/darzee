import { Component, OnInit, ViewChild, EventEmitter, Output, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject, Observable, merge, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { MongooseDataSharedServiceService } from 'src/app/core/services/mongoose-data-shared-service/mongoose-data-shared-service.service';
import { MongooseRunNode } from 'src/app/core/models/mongoose-run-node.model';
import { PrometheusApiService } from 'src/app/core/services/prometheus-api/prometheus-api.service';
import { HttpUtils } from 'src/app/common/HttpUtils';
import { LocalStorageService } from 'src/app/core/services/local-storage-service/local-storage.service';
import { SharedLayoutService } from 'src/app/core/services/shared-layout-service/shared-layout.service';
import { MongooseNotification } from 'src/app/core/services/shared-layout-service/notification/mongoose-notification.model';

@Component({
  selector: 'app-prometheus-error',
  templateUrl: './prometheus-error.component.html',
  styleUrls: ['./prometheus-error.component.css']
})
export class PrometheusErrorComponent implements OnInit, OnDestroy {

  /**
   * @param prometheusAddressTypeheadInstance references to input field for Prometheus IP address.
   * @param onPrometheusLoad emits an event once Prometheus has been loaded.
   */
  @ViewChild(`prometheusAddressTypeheadInstance`) prometheusAddressTypeheadInstance: NgbTypeahead;
  @Output() onPrometheusLoad = new EventEmitter();


  private readonly DEFAULT_PROMETHEUS_NODE_ADDRESS = "localhost";
  private readonly DEFAULT_PROMETHEUS_NODE_PORT = "9090";

  /**
   * @param prometheusResourceLocation address of Prometheus displaying within the alert.
   */
  public prometheusResourceLocation: string = "";
  public currentEnteredText: string = "";
  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();

  private possiblePrometheusNodesList: string[] = [];
  private activeSubscriptions: Subscription = new Subscription();

  private isLoadingInProgress: boolean = false;

  constructor(private mongooseDataSharedServiceService: MongooseDataSharedServiceService,
    private prometheusApiService: PrometheusApiService,
    private localStorageService: LocalStorageService,
    private sharedLayourService: SharedLayoutService) {
    this.setUpComponent();
  }

  ngOnInit() {
    this.subscribeToPossiblePrometheusRunNodes();
  }

  ngOnDestroy() {
    this.activeSubscriptions.unsubscribe();
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
    const isInputEmpty: boolean = (enteredPrometheusAddress.length == 0);
    if (isInputEmpty) { 
      // NOTE: Empty input should not be processed.
      this.sharedLayourService.showNotification(new MongooseNotification('error', `Please, provide Prometheus' address.` ));
      return;
    }

    if (!HttpUtils.isIpAddressValid(enteredPrometheusAddress)) {
      this.sharedLayourService.showNotification(new MongooseNotification('error', `Please, provide a valid Prometheus' address.`));
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
          // NOTE: Adding default Prometheus address.
          let defaultPrometheusAddress = `${this.DEFAULT_PROMETHEUS_NODE_ADDRESS}:${this.DEFAULT_PROMETHEUS_NODE_PORT}`;
          availableRunNodeAddressess.push(defaultPrometheusAddress);
          this.possiblePrometheusNodesList = availableRunNodeAddressess as string[];
        }
      )
    )
  }

  /**
   * Reload Prometheus on provided address. If address is reachable, it saves it into browser's local storage.
   * @param prometheusAddress IP address of Prometheus.
   */
  private tryToLoadPrometheus(prometheusAddress: string) {
    this.isLoadingInProgress = true;
    // NOTE: Pruning prefixes in order to exclude invalid target URl and any errors ...
    // ... within services.
    const prometheusAddressWithoutPrefixes: string = HttpUtils.pruneHttpPrefixFromAddress(prometheusAddress);
    
    this.activeSubscriptions.add(
      this.prometheusApiService.isAvailable(prometheusAddressWithoutPrefixes).subscribe(
        (isPrometheusAvailable: boolean) => {
          this.isLoadingInProgress = false;
          this.prometheusResourceLocation = prometheusAddressWithoutPrefixes;
          if (!isPrometheusAvailable) {
            console.error(`Prometheus is not available on ${prometheusAddressWithoutPrefixes}`);
            this.sharedLayourService.showNotification(new MongooseNotification('error', `Prometheus is not available at ${prometheusAddress}.`));
            return;
          }
          console.log(`Prometheus has successfully loaded on ${prometheusAddressWithoutPrefixes}.`);
          // NOTE: Saving Prometheus' address if true.
          this.localStorageService.savePrometheusHostAddress(prometheusAddressWithoutPrefixes);
          // NOTE: Updating Prometheus' address.
          this.prometheusApiService.setHostIpAddress(prometheusAddressWithoutPrefixes);
          this.onPrometheusLoad.emit();
        }
      )
    )
  }

  private setUpComponent() {
    let prometheusBaseAddress: string = environment.prometheusIp;
    let prometheusPort: string = environment.prometheusPort;
    this.activeSubscriptions.add(
      // NOTE: Subscribing to change of Prometheus service in order to ...
      // ...
      this.prometheusApiService.getCurrentAddress().subscribe(
        (currentPrometheusAddress: string) => {
          this.prometheusResourceLocation = currentPrometheusAddress;
          this.tryToLoadPrometheus(currentPrometheusAddress);
        }
      )
    )
    this.prometheusResourceLocation = `${prometheusBaseAddress}:${prometheusPort}`;
  }

}
