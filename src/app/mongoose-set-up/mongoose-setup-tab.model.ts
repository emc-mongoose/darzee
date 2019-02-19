export class MongooseSetupTab { 
    public title: string;
    public contentLink: string; 
    public isCompleted: boolean = false
    public isContentDisplaying: boolean = false;

    constructor(title: string, url: string) { 
        this.title = title;
        this.contentLink = url;
    }
}