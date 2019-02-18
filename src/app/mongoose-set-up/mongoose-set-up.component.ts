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
    {title: 'Nodes', isCompleted: false, percentage: 0, url: 'nodes'},
    {title: 'Configuration', isCompleted: false, percentage: 0, url: 'editing-scenarios'},
    {title: 'Scenario', isCompleted: false, percentage: 0, url: 'control'}
  ]

  currentStepNumber: number = 0;

  constructor(private router: Router) { }

  // MARK: - Lifecycle 

  ngOnInit() {
    this.router.navigate([this.BASE_URL, this.setUpSteps[this.currentStepNumber].url]);
  }

  // MARK: - Public 

  getComplitionPercentage(): number { 
    return this.setUpSteps[this.currentStepNumber].percentage;
    // NOTE: 'rawPercentage' is percents represented in decimal values (e.g.: 0.3, etc.).
    // let rawPercentage = ((this.currentStepNumber + 1) / this.setUpSteps.length);
    // return rawPercentage * 100;
  }

  getCurrentStepName(): string { 
    return this.setUpSteps[this.currentStepNumber].title;
  }

  getPercentagePerStep(): number { 
    let rawPercentage = (100 / this.setUpSteps.length);
    // console.log("Percentage per step: ", rawPercentage);
    return rawPercentage;
  }

  onNextStepClicked() { 
    this.setUpSteps[this.currentStepNumber].isCompleted = true; 
    this.setUpSteps[this.currentStepNumber].percentage = 100;
    this.currentStepNumber++; 
    this.router.navigate([this.BASE_URL, this.setUpSteps[this.currentStepNumber].url]);
  }

}
