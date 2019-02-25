export class MongooseSetupTab { 
    private id: number;
    public title: string;
    public contentLink: string; 
    public isCompleted: boolean = false
    public isContentDisplaying: boolean = false;

    constructor(id: number, title: string, url: string) { 
        this.id = id; 
        this.title = title;
        this.contentLink = url;
    }

    // MARK: - Public
    
    getId(): number { 
        return this.id;
    }
}