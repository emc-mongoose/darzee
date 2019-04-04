import { MongooseRunRecord } from "src/app/core/models/run-record.model";
import { MonitoringApiService } from "src/app/core/services/monitoring-api/monitoring-api.service";
import { MongooseRunStatus } from "src/app/core/mongoose-run-status";
import { Subscribable, Subscriber, Subscription, Observable, of } from "rxjs";
import { OnInit, OnDestroy } from "@angular/core";
import { map } from "rxjs/operators";

export class MongooseRunTab implements OnInit, OnDestroy { 

    public tabTitle: string;
    public isSelected: boolean = false; 
    private amountOfRecords: number = 0; 
    private monitoringApiSubscriptions: Subscription;

    // MARK: - Lifecycle 

    constructor(amountOfRecords: number, status: string) { 
        this.tabTitle = status;
        this.amountOfRecords = amountOfRecords;
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
        let elementsAmountTag = "(" + this.amountOfRecords + ")";
        let delimiter = " ";
        return (this.tabTitle + delimiter + elementsAmountTag); 
    }

}