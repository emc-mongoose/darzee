export class BasicTab {

    public isActive: boolean = false
    private name: String;
    private link: String;
    private id: String; 

    // MARK: - Getters & Setters 

    public getId(): String { 
        return this.id;
    }

    public getLink(): String { 
        return this.link;
    }

    public onTabSelected() { 
        this.isActive = !this.isActive; 
    }

    constructor(name: String = "", link: String = "") { 
        this.name = name;
        this.link = link;
        
        this.isActive = false;
        this.id = this.getUniqueIdentifier(); 
    }


    // MARK: - Public 

    public isEqual(comparingTab): boolean { 
        return (this.id == comparingTab.getId());
    }

    // MARK: - Private
    private getUniqueIdentifier(): string { 
        const currentDateTime = new Date().getMilliseconds();
        const hexNumericSystemBase = 16; 
        return currentDateTime.toString(hexNumericSystemBase) + this.name;
      }
}