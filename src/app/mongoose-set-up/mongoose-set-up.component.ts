import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mongoose-set-up',
  templateUrl: './mongoose-set-up.component.html',
  styleUrls: ['./mongoose-set-up.component.css']
})
export class MongooseSetUpComponent implements OnInit {

  readonly setUpSteps = [
    {stepName: 'Nodes', url: '/runs'},
    {stepName: 'Configuration', url: '/nodes'},
    {stepName: 'Scenario', url: '/control'}
  ]

  currentStepNumber: number = 1;

  constructor() { }

  // MARK: - Lifecycle 

  ngOnInit() {}

  // MARK: - Public 

  getComplitionPercentage(): number { 
    // NOTE: 'rawPercentage' is percents represented in decimal values (e.g.: 0.3, etc.).
    let rawPercentage = (this.currentStepNumber / this.setUpSteps.length);
    return rawPercentage * 100;
  }

  getCurrentStepName(): string { 
    // '1' is subbsracted in order to match array's number system which starts from zero.
    return this.setUpSteps[this.currentStepNumber - 1].stepName;
  }

}
