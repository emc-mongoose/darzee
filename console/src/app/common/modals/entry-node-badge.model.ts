export class EntryNodeBadgeModel { 
    public title: string = "";
    public reason: string = "";
    public class: string = "";
    public style: any;

    constructor(title: string = "", reason: string = "",  cssClass: string = "", style: any = "") { 
        this.title = title; 
        this.reason = reason; 
        this.class = cssClass;
        this.style = style;
    }
}
