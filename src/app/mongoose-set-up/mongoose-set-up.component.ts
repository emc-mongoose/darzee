import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MongooseSetupTab } from './mongoose-setup-tab.model';
import { bounceAnimation, slideAnimation } from '../core/animations';
import { MongooseSetupStep } from './mongoose-setup-step.interface';
import { MongooseSetUpService } from './mongoose-set-up-service/mongoose-set-up.service';
import { RoutesList } from '../routes';

@Component({
  selector: 'app-mongoose-set-up',
  templateUrl: './mongoose-set-up.component.html',
  styleUrls: ['./mongoose-set-up.component.css'],
  animations: [
    bounceAnimation,
    slideAnimation
  ]
})

export class MongooseSetUpComponent implements OnInit {


  readonly BASE_URL = "/" + RoutesList.MONGOOSE_SETUP;
  
  readonly SETUP_TABS_DATA = [
    {title: 'Nodes', link: RoutesList.NODES},
    {title: 'Configuration', link: RoutesList.MONGOOSE_COMFIGURATION},
    {title: 'Scenario', link: RoutesList.SCENARIO}

  ];

  setUpTabs: MongooseSetupTab[] = []
  processingTabID: number = 0;

  private getCurrentSetupTab(): MongooseSetupTab { 
    return this.setUpTabs[this.processingTabID];
  }

  constructor(
    private router: Router;
    private mongooseSetUpService: MongooseSetUpService
    ) {
    this.initSetUpTabs();
    let defaultTabNumber = 0;
    this.openUpTab(defaultTabNumber);
   }

  // MARK: - Lifecycle 

  ngOnInit() {}

  // MARK: - Public 

  getCurrentStepName(): string { 
    return this.setUpTabs[this.processingTabID].title;
  }

  getPercentagePerTab(): number { 
    let rawPercentage = (100 / this.setUpTabs.length);
    // NOTE: tabs offset is an estimated value. 
    let tabsOffset = this.setUpTabs.length;
    return Math.round(rawPercentage) - tabsOffset;
  }

  onConfirmClicked() { 
    let processingTab = this.getCurrentSetupTab(); 
    this.updateSetUpInfoFromSource(processingTab.contentLink);
    processingTab.isCompleted = true;
    let nextTabId = this.processingTabID + 1;
    this.switchTab(nextTabId);
  }

  isSetupCompleted() { 
    return this.setUpTabs.every(tab => tab.isCompleted);
  }

  onTabClicked(tabId: number) { 
    this.openUpTab(tabId);
    console.log("Tab with ID: ", tabId, " has been selected.");
  }

  onRunBtnClicked() { 
    alert("Mongoose has started up.");
  }

  onRouterComponentActivated($event) { 
    console.log("Activating " + this.getCurrentStepName());
    // console.log("Router component has been activated.");
  }

  onRouterComponentDeactivated($event) { 
    console.log("Deativating " + this.getCurrentStepName());
  }

  getConfigrmationBtnTitle(): string { 
    return (this.isSetupCompleted() ? "Configuration completed  ✔" : "Confirm »");
  }

  // MARK: - Private

  private initSetUpTabs() { 
    // NOTE: Filling up the array based on the tab-wrapper class. 
    // ... The wrapper is used in order to properly handle different tab states. 
    for (var i:number = 0; i < this.SETUP_TABS_DATA.length; ++i) { 
      let tabData = this.SETUP_TABS_DATA[i];
      let mongooseTab = new MongooseSetupTab(i, tabData.title, tabData.link);
      this.setUpTabs.push(mongooseTab);
    }
  }

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

    // NOTE: Source Link is the link to page from which the set up info will be updated. 
    private updateSetUpInfoFromSource(sourceLink: string) { 
      // NOTE: Confirming set up data from the **source** page. 
      switch (sourceLink) { 
        case RoutesList.MONGOOSE_COMFIGURATION: {
          this.mongooseSetUpService.confirmConfigurationSetup();  
          break;
        }
        case RoutesList.SCENARIO: { 
          this.mongooseSetUpService.confirmScenarioSetup();
          break;
        }
        case RoutesList.NODES: { 
          this.mongooseSetUpService.confirmNodeConfiguration();
          break;
        }
      }
    }

}
