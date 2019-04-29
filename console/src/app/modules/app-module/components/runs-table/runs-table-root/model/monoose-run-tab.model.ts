import { Subscription, Observable, BehaviorSubject } from "rxjs";
import { OnInit, OnDestroy } from "@angular/core";

export class MongooseRunTab implements OnInit, OnDestroy {

    private readonly INITIAL_AMOUNT_OF_RECORDS = 0;

    public tabTitle: string;
    public isSelected: boolean = false;

    private amountOfRecords$: BehaviorSubject<Number> = new BehaviorSubject<Number>(this.INITIAL_AMOUNT_OF_RECORDS);
    private recordsUpdateSubscription: Subscription = new Subscription();


    // MARK: - Lifecycle 

    constructor(amountOfRecords$: Observable<Number>, status: string) {
        this.tabTitle = status;
        this.recordsUpdateSubscription.add(
            amountOfRecords$.subscribe(
                amount => {
                    this.amountOfRecords$.next(amount);
                }
            )
        );

    }

    ngOnInit(): void { }

    ngOnDestroy(): void {
        this.recordsUpdateSubscription.unsubscribe()
    }

    // MARK: - Public

    public getAmountOfRecords(): Number {
        return this.amountOfRecords$.getValue();
    }

    public getAmountOfRecordsValue(): Number {
        return this.amountOfRecords$.getValue();
    }

    public setAmountOfRecords(amount: number) {
        this.amountOfRecords$.next(amount);
    }

    // NOTE: Tab Tag format is: " *tab title* (*amount of matching tabs*) "
    public getTabTag(): string {
        let elementsAmountTag = "(" + this.amountOfRecords$.getValue() + ")";
        let delimiter = " ";
        return (this.tabTitle + delimiter + elementsAmountTag);
    }

    public getStatus(): string {
        return this.tabTitle;
    }

}