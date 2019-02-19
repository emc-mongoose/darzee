import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MongooseSetupTab } from './mongoose-setup-tab.model';
import { bounceAnimation, slideAnimation } from '../core/animations';
import { IdFabric } from '../common/utilities/id-fabric';

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

  readonly BASE_URL = "/setup";
  
  readonly SETUP_TABS_DATA = [
    {title: 'Nodes', link: 'nodes'},
    {title: 'Configuration', link: 'editing-scenarios'},
    {title: 'Scenario', link: 'control'}

  ];

  setUpTabs: MongooseSetupTab[] = []
  processingTabID: number = 0;

  constructor(private router: Router) {
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

  onNextStepClicked() { 
    let nextTabId = this.processingTabID + 1;
    this.setUpTabs[this.processingTabID].isCompleted = true;
    this.switchTab(nextTabId);
  }

  isSetupCompleted() { 
    return this.setUpTabs.every(tab => tab.isCompleted);
  }

  onTabClicked(tabId: number) { 
    this.openUpTab(tabId);
    console.log("Tab with ID: ", tabId, " has been selected.");
  }

  // MARK: - Private

  private initSetUpTabs() { 
    // NOTE: Filling up the array based on the tab-wrapper class. 
    // ... The wrapper is used in order to properly handle different tab states. 
    for (var tabData of this.SETUP_TABS_DATA) { 
      let mongooseTab = new MongooseSetupTab(IdFabric.getUniqueIdentifier(), tabData.title, tabData.link);
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

}
