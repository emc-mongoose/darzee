import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-run-statistics',
  templateUrl: './run-statistics.component.html',
  styleUrls: ['./run-statistics.component.css']
})
export class RunStatisticsComponent implements OnInit {

  public displayingRecordId: number; 
  private routeParameters: any; 

  constructor(private route: ActivatedRoute) { }

  // MARK: - Lifecycle 

  ngOnInit() {
    this.routeParameters = this.route.params.subscribe(params => { 
      this.displayingRecordId += params['id'];
      console.log("Loading record with ID: " + this.displayingRecordId);
    });
  }

  ngOnDestroy() { 
    this.routeParameters.unsubscribe();
  }

  // MARK: - Public 

}
