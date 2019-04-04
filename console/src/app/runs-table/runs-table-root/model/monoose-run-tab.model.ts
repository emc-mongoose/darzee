import { MongooseRunRecord } from "src/app/core/models/run-record.model";
import { MonitoringApiService } from "src/app/core/services/monitoring-api/monitoring-api.service";
import { MongooseRunStatus } from "src/app/core/mongoose-run-status";
import { Subscribable, Subscriber, Subscription, Observable, of } from "rxjs";
import { OnInit, OnDestroy } from "@angular/core";
import { map } from "rxjs/operators";

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
        
    }

    ngOnDestroy(): void { 
        console.log("Mongoose run tab on destroy.");
        this.monitoringApiSubscriptions.unsubscribe(); 
    }

    // MARK: - Public

    // NOTE: Tab Tag format is: " *tab title* (*amount of matching tabs*) "
    public getTabTag(): string { 
        let elementsAmountTag = "(" + this.filtredRecords.length + ")";
        let delimiter = " ";
        return (this.tabTitle + delimiter + elementsAmountTag); 
    }

}