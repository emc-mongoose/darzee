import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MongooseSetupTab } from './mongoose-setup-tab.model';

@Component({
  selector: 'app-mongoose-set-up',
  templateUrl: './mongoose-set-up.component.html',
  styleUrls: ['./mongoose-set-up.component.css']
})

export class MongooseSetUpComponent implements OnInit {

  readonly BASE_URL = "/setup";

  setUpTabs: MongooseSetupTab[] = []
  processingTabID: number = 0;

  constructor(private router: Router) {
    this.initSetUpTabs();
    let defaultTabNumber = 0;
    this.openUpTab(defaultTabNumber);
   }

  // MARK: - Lifecycle 

  ngOnInit() {
    
  }

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
    this.switchTab(nextTabId);
  }

  isSetupCompleted() { 
    return this.setUpTabs.every(tab => tab.isCompleted);
  }

  // MARK: - Private

  private initSetUpTabs() { 
    this.setUpTabs.push(new MongooseSetupTab("Nodes", "nodes"));
    this.setUpTabs.push(new MongooseSetupTab("Configuration", "editing-scenarios"));
    this.setUpTabs.push(new MongooseSetupTab("Scenario", "control"));
  }

  private openUpTab(tabNumber: number) { 
    if (tabNumber >= this.setUpTabs.length) { 
      return;
    }
    this.setUpTabs[tabNumber].isContentDisplaying = true; 
    this.router.navigate([this.BASE_URL, this.setUpTabs[tabNumber].contentLink]);
    this.processingTabID = tabNumber;
  }

  private switchTab(nextTabId: number) { 
    if (nextTabId > this.setUpTabs.length) { 
      return;
    }
    this.setUpTabs[this.processingTabID].isContentDisplaying = false; 
    this.setUpTabs[this.processingTabID].isCompleted = true;
    this.openUpTab(nextTabId);
  }

}
