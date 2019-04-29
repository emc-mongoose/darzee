import { Subscription, Observable, BehaviorSubject } from "rxjs";
import { OnInit, OnDestroy } from "@angular/core";

export class MongooseRunTab implements OnInit, OnDestroy { 

    public tabTitle: string;
    public isSelected: boolean = false; 
    private amountOfRecords: Number = 0; 
    private monitoringApiSubscriptions: Subscription;

    private amountOfRecords$: BehaviorSubject<Number> = new BehaviorSubject<Number>(0);

    // MARK: - Lifecycle 

    constructor(amountOfRecords: Number, status: string) { 
        this.tabTitle = status;
        this.amountOfRecords = amountOfRecords; 
        // this.monitoringApiSubscriptions = amountOfRecords$.subscribe(amount => { 
        //     this.amountOfRecords = amount;
        //     this.amountOfRecords$.next(amount);
        // });
    }

    ngOnInit(): void {  }

    ngOnDestroy(): void { 
        this.monitoringApiSubscriptions.unsubscribe(); 
    }

    // MARK: - Public

    public getAmountOfRecords(): Number { 
        return this.amountOfRecords;
    }
    
    public getAmountOfRecordsValue(): Number { 
        return this.amountOfRecords$.getValue(); 
    }

    public setAmountOfRecords(amount: number) { 
        this.amountOfRecords = amount;
    }

    // NOTE: Tab Tag format is: " *tab title* (*amount of matching tabs*) "
    public getTabTag(): string { 
        let elementsAmountTag = "(" + this.amountOfRecords + ")";
        let delimiter = " ";
        return (this.tabTitle + delimiter + elementsAmountTag); 
    }

    public getStatus(): string { 
        return this.tabTitle;
    }

}