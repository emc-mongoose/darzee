import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MongooseSetupTab } from '../../models/mongoose-setup-tab.model';
// import { slideAnimation } from '../../../core/animations';
import { RoutesList } from '../../../app-module/Routing/routes-list';
import { Subscription, timer } from 'rxjs';
import { Constants } from '../../../../common/constants';
import { MongooseSetUpService } from '../../../../core/services/mongoose-set-up-service/mongoose-set-up.service';
import { NodesComponent } from './set-up-steps/nodes/nodes.component';
import { MongooseDataSharedServiceService } from 'src/app/core/services/mongoose-data-shared-service/mongoose-data-shared-service.service';
import { NodeAlert } from './set-up-steps/nodes/node-alert.interface';
import { BasicModalComponent } from 'src/app/common/modals/basic-modal.template';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-mongoose-set-up',
  templateUrl: './mongoose-set-up.component.html',
  styleUrls: ['./mongoose-set-up.component.css'],
  providers: [MongooseSetUpService]
})

export class MongooseSetUpComponent implements OnInit, OnDestroy {

  readonly BASE_URL = "/" + RoutesList.MONGOOSE_SETUP;
  readonly SETUP_TABS_DATA = [
    { title: 'Nodes', link: RoutesList.NODES },
    { title: 'Configuration', link: RoutesList.MONGOOSE_COMFIGURATION },
    { title: 'Scenario', link: RoutesList.SCENARIO }
  ];

  @ViewChild('modalAlertTemplate') modalAlertTemplate: TemplateRef<any>;
  modalAlertReference: BsModalRef;
  config = {
    backdrop: false,
    ignoreBackdropClick: false
  };

  public setUpTabs: MongooseSetupTab[] = []
  public processingTabID: number = 0;
  public alerts: NodeAlert[] = [];

  private mongooseRunSubscription: Subscription = new Subscription();

  private getCurrentSetupTab(): MongooseSetupTab {
    return this.setUpTabs[this.processingTabID];
  }

  // MARK: - Lifecycle 

  constructor(
    private router: Router,
    private mongooseSetUpService: MongooseSetUpService,
    private mongooseDataSharedServiceService: MongooseDataSharedServiceService,
    private modalService: NgbModal,
    private bsModalService: BsModalService) {
    this.initSetUpTabs();
    let defaultTabNumber = 0;
    this.openUpTab(defaultTabNumber);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.mongooseRunSubscription.unsubscribe();
  }

  // MARK: - Public 

  public getCurrentStepName(): string {
    return this.setUpTabs[this.processingTabID].title;
  }

  public getCurrentComplitionPercentage(): number {
    return (this.getPercentagePerTab() * (this.processingTabID + 1));
  }

  public onConfirmClicked() {
    let currentTab: MongooseSetupTab = this.getCurrentSetupTab();
    switch (currentTab.contentLink) {
      case RoutesList.NODES: {
        currentTab.isCompleted = this.isNodeSetUpComplete();
        if (!currentTab.isCompleted) {
          this.modalAlertReference = this.bsModalService.show(this.modalAlertTemplate, this.config);
          const timeUntilModalGetsClosedMs: number = 2500;
          setTimeout(() => {
            this.modalAlertReference.hide();
          }, timeUntilModalGetsClosedMs);
          return;
        }
      }
    }
    currentTab.isCompleted = this.isNodeSetUpComplete();
    let nextTabId = this.processingTabID + 1;
    this.switchTab(nextTabId);
  }

  public isSetupCompleted() {
    return this.setUpTabs.every(tab => tab.isCompleted);
  }

  public onTabClicked(tabId: number) {
    this.openUpTab(tabId);
  }

  public onRunBtnClicked() {
    // NOTE: Launching Mongoose on its entry node.
    let mongooseEntryNode = this.mongooseSetUpService.getMongooseEntryNode();
    this.mongooseRunSubscription = this.mongooseSetUpService.runMongoose(mongooseEntryNode).subscribe(
      mongooseRunId => {
        // NOTE: Updated Metrics will include both run ID and load step ID. In case ...
        // ... it won't be implimented, map them here. If you want to get ...
        // ... load step id, you can do it via mongoose set up service. 
        console.log("Launched Mongoose run with run ID: ", mongooseRunId);

        // NOTE: Loading spinning bar. It will disappear once Mongoose run will be loaded.
        this.mongooseDataSharedServiceService.shouldWaintForNewRun = true;

        // NOTE: If run ID has been returned from the server, Mongoose run has started
        let hasMongooseSuccessfullyStarted = (mongooseRunId != undefined);
        if (!hasMongooseSuccessfullyStarted) {
          let misleadingMessage = `Unable to launch Mongoose - run ID hasn't been generated. Details: ${JSON.stringify(mongooseRunId)}`;
          alert(misleadingMessage);
        } else {
          console.log(`Mongoose Run has started with run ID ${mongooseRunId}`);
        }

        this.router.navigate([RoutesList.RUNS]);
      },
      error => {
        let errorReason = "Unable to launch Mongoose on node due to an unknown reason.";
        if (error.status != undefined) {
          if (error.status == Constants.HttpStatus.CONFLICT) {
            errorReason = "Another Mongoose run has already been launched on node " + this.mongooseSetUpService.getMongooseEntryNode() + ". Consider set another node as the entry one or use another port.";
          }
        }

        const modalMongooseLaunchAlertError: NgbModalRef = this.modalService.open(BasicModalComponent);
        modalMongooseLaunchAlertError.componentInstance.title = 'Error';
        modalMongooseLaunchAlertError.componentInstance.discription = errorReason;

        console.error(`Unable to launch Mongoose. Reason: ${JSON.stringify(error)}`);
      });
  }

  public onRouterComponentActivated($event) { }

  public onRouterComponentDeactivated($event) { }

  public getConfigrmationBtnTitle(): string {
    return (this.isSetupCompleted() ? "Configuration completed  ✔" : "Confirm »");
  }

  // MARK: - Private

  private initSetUpTabs() {
    // NOTE: Filling up the array based on the tab-wrapper class. 
    // ... The wrapper is used in order to properly handle different tab states. 
    for (var i: number = 0; i < this.SETUP_TABS_DATA.length; ++i) {
      let tabData = this.SETUP_TABS_DATA[i];
      let mongooseTab = new MongooseSetupTab(i, tabData.title, tabData.link);
      this.setUpTabs.push(mongooseTab);
    }
  }

  // NOTE: Function that does open up a specific set up tab. 
  private openUpTab(tabNumber: number) {
    if (tabNumber >= this.setUpTabs.length) {
      console.error("Unable to open tab number ", tabNumber, " since it doesn't exist.");
      return;
    }
    // NOTE: Hiding content of current tab, showing up another's. 
    this.setUpTabs[this.processingTabID].isContentDisplaying = false;
    this.setUpTabs[tabNumber].isContentDisplaying = true;

    this.router.navigate([this.BASE_URL, this.setUpTabs[tabNumber].contentLink]);
    this.processingTabID = tabNumber;
  }

  private switchTab(nextTabId: number) {
    if (nextTabId > this.setUpTabs.length) {
      console.error("Unable to switch to tab number ", nextTabId, " since it doesn't exist.");
      return;
    }
    this.setUpTabs[this.processingTabID].isContentDisplaying = false;
    this.openUpTab(nextTabId);
  }

  private isNodeSetUpComplete(): boolean {
    // NOTE: Allowing switching set up tab only if target run nodes were selected 
    let hasMongooseRunNodesSelected = (this.mongooseSetUpService.getSelectedMongooseRunNodes().length > 0);
    return hasMongooseRunNodesSelected;
  }

  private getPercentagePerTab(): number {
    let rawPercentage = (100 / this.setUpTabs.length);
    return Math.ceil(rawPercentage);
  }

}
