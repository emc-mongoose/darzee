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
    {stepName: 'Nodes', url: 'runs'},
    {stepName: 'Configuration', url: 'nodes'},
    {stepName: 'Scenario', url: 'control'}
  ]

  currentStepNumber: number = 0;

  constructor(private router: Router) { }

  // MARK: - Lifecycle 

  ngOnInit() {
    this.router.navigate([this.BASE_URL, this.setUpSteps[this.currentStepNumber].url]);
  }

  // MARK: - Public 

  getComplitionPercentage(): number { 
    // NOTE: 'rawPercentage' is percents represented in decimal values (e.g.: 0.3, etc.).
    let rawPercentage = ((this.currentStepNumber + 1) / this.setUpSteps.length);
    return rawPercentage * 100;
  }

  getCurrentStepName(): string { 
    // '1' is subbsracted in order to match array's number system which starts from zero.
    return this.setUpSteps[this.currentStepNumber].stepName;
  }

  onNextStepClicked() { 
    this.currentStepNumber++; 
    this.router.navigate([this.BASE_URL, this.setUpSteps[this.currentStepNumber].url]);
  }

}
