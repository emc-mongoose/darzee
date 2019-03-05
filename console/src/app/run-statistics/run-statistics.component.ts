import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MonitoringApiService } from '../core/services/monitoring-api/monitoring-api.service';
import { MongooseRunRecord } from '../core/models/run-record.model';
import { BasicTab } from '../common/BasicTab/BasicTab';
import { RoutesList } from '../routes-list';

@Component({
  selector: 'app-run-statistics',
  templateUrl: './run-statistics.component.html',
  styleUrls: ['./run-statistics.component.css']
})
export class RunStatisticsComponent implements OnInit {

  private readonly STATISTICS_SECTIONS: String[] = ["Logs", "Charts"];
  private statisticTabs: BasicTab[] = [];

  private routeParameters: any;
  private runRecord: MongooseRunRecord;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private monitoringApiService: MonitoringApiService) {
    this.initTabs();

  }

  // MARK: - Lifecycle 

  ngOnInit() {
    // NOTE: Getting ID of the required Run Record from the HTTP query parameters. 
    this.routeParameters = this.route.params.subscribe(params => {
      // TODO: Move parameter name into constants 
      let displayingRecordId = params['id'];
      this.runRecord = this.monitoringApiService.getMongooseRunRecordById(displayingRecordId);
    });
  }

  ngOnDestroy() {
    this.routeParameters.unsubscribe();
  }

  // MARK: - Public 

  switchTab(targetTabId: BasicTab) {

    this.statisticTabs.forEach(section => {
      if (targetTabId.isEqual(section)) {
        section.isActive = true;
        return;
      }
      section.isActive = false;
    });
    this.router.navigate(['/' + RoutesList.RUN_STATISTICS + '/' + this.runRecord.getIdentifier() + '/logs']);

  }

  // MARK: - Private

  private initTabs() {
    // NOTE: Filling up statistic tabs data  
    for (let sectionName of this.STATISTICS_SECTIONS) {
      // TODO: Change link to actual one.
      let TAB_LINK_MOCK = "/";
      let tab = new BasicTab(sectionName, TAB_LINK_MOCK);
      this.statisticTabs.push(tab);
    }
    let initialSelectedTabNumber = 0;
    this.statisticTabs[initialSelectedTabNumber].onTabSelected();
  }



}
