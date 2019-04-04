import { MongooseRunRecord } from "src/app/core/models/run-record.model";
import { MonitoringApiService } from "src/app/core/services/monitoring-api/monitoring-api.service";
import { MongooseRunStatus } from "src/app/core/mongoose-run-status";
import { Subscribable, Subscriber, Subscription } from "rxjs";
import { OnInit, OnDestroy } from "@angular/core";

export class MongooseRunTab implements OnInit, OnDestroy { 

    public tabTitle: string;
    public filtredRecords: MongooseRunRecord[] = [];
    public isSelected: boolean = false; 

    private monitoringApiSubscriptions: Subscription;

    // MARK: - Lifecycle 

    constructor(private monitoringApiService: MonitoringApiService, status: string) { 
        this.tabTitle = status;
    }

    ngOnInit(): void { 
        this.monitoringApiSubscriptions = this.monitoringApiService.getCurrentMongooseRunRecords().subscribe(
            result => { 
                this.filtredRecords = this.filterRunfiltredRecordsByStatus(result, status);
            },
            error => { 
                console.error(`Something went wront during filtring records by status: ${error.message}`);
            }
        )
    }

    ngOnDestroy(): void { 
        this.monitoringApiSubscriptions.unsubscribe(); 
    }

    // MARK: - Public

    // NOTE: Tab Tag format is: " *tab title* (*amount of matching tabs*) "
    getTabTag(): string { 
        let elementsAmountTag = "(" + this.filtredRecords.length + ")";
        let delimiter = " ";
        return (this.tabTitle + delimiter + elementsAmountTag); 
    }

    // MARK: - Private 

    private filterRunfiltredRecordsByStatus(records: MongooseRunRecord[], requiredStatus: string): MongooseRunRecord[] {
        if (requiredStatus.toString() == MongooseRunStatus.All) { 
            return records;
          }
          // NOTE: Iterating over existing tabs, filtring them by 'status' property.
          var requiredfiltredRecords: MongooseRunRecord[] = [];
          for (var runRecord of records) { 
            if (runRecord.status == requiredStatus) { 
                requiredfiltredRecords.push(runRecord);
            }
        }
        return requiredfiltredRecords;
    }

}