import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MonitoringApiService } from '../core/services/monitoring-api/monitoring-api.service';
import { MongooseRunRecord } from '../core/models/run-record.model';
import { BasicTab } from '../common/BasicTab/BasicTab';

@Component({
  selector: 'app-run-statistics',
  templateUrl: './run-statistics.component.html',
  styleUrls: ['./run-statistics.component.css']
})
export class RunStatisticsComponent implements OnInit {

  private readonly STATISTICS_SECTIONS: String[] = ["Logs", "Charts"];
  private statisticTabs: BasicTab[] = [];
  private readonly SECTIONS = [
    { name: "Logs", isSelected: true, url: '' },
    { name: "Charts", isSelected: false, url: '' }
  ]

  private routeParameters: any;
  private runRecord: MongooseRunRecord;

  constructor(private route: ActivatedRoute,
    private monitoringApiService: MonitoringApiService) {
      // NOTE: Filling up statistic tabs data  
    for (let sectionName of this.STATISTICS_SECTIONS) {
      // TODO: Change link to actual one.
      let TAB_LINK_MOCK = "/";
      let tab = new BasicTab(sectionName, TAB_LINK_MOCK);
      this.statisticTabs.push(tab);
    }

    this.statisticTabs[0].onTabSelected(); 

  }

  // MARK: - Lifecycle 

  ngOnInit() {
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

  switchTab(targetTab) {
    console.log(targetTab);
    targetTab.isSelected = !targetTab.isSelected;
  }

}
