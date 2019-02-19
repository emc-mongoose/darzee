import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mongoose-set-up',
  templateUrl: './mongoose-set-up.component.html',
  styleUrls: ['./mongoose-set-up.component.css']
})

export class MongooseSetUpComponent implements OnInit {

  readonly BASE_URL = "/setup";

  readonly setUpSteps = [
    {title: 'Nodes', isCompleted: false, url: 'nodes'},
    {title: 'Configuration', isCompleted: false, url: 'editing-scenarios'},
    {title: 'Scenario', isCompleted: false, url: 'control'}
  ]
  
  currentStepNumber: number = 0;

  constructor(private router: Router) { }

  // MARK: - Lifecycle 

  ngOnInit() {
    this.router.navigate([this.BASE_URL, this.setUpSteps[this.currentStepNumber].url]);
  }

  // MARK: - Public 

  getCurrentStepName(): string { 
    return this.setUpSteps[this.currentStepNumber].title;
  }

  getPercentagePerTab(): number { 
    let rawPercentage = (100 / this.setUpSteps.length);
    // NOTE: tabs offset is an estimated va
    let tabsOffset = this.setUpSteps.length;
    return Math.round(rawPercentage) - tabsOffset;
  }

  onNextStepClicked() { 
    this.setUpSteps[this.currentStepNumber].isCompleted = true; 
    this.currentStepNumber++; 
    this.router.navigate([this.BASE_URL, this.setUpSteps[this.currentStepNumber].url]);
  }

}
