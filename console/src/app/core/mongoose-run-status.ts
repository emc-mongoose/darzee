export enum MongooseRunStatus { 
    
    // NOTE: "All" status is used to match every existing Mongoose Run Record.
    // It's being used in filter purposes. 
    All = "All",
    Undefined = "Undefined", 
    Finished = "Finished", 
    Unavailable = "Unavailable",
    Running = "Running",
}