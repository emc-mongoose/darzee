import { BehaviorSubject } from "rxjs";

export class MongooseSetupInfoModel { 

    configuration: any; // NOTE: Configuration is represented with JSON 
    scenario: String; // NOTE: As for 22.02.2019, 'Scenario' is a JavaScript code
    nodesData: String[]; 

    private readonly DEFAULT_CONFIGURATION = "";
    private readonly DEFAULT_SCENARIO = "Load.run();";

    constructor(observableSlaveNodes: BehaviorSubject<String[]>) { 
        this.configuration = this.DEFAULT_CONFIGURATION;
        this.scenario = this.DEFAULT_SCENARIO;
        observableSlaveNodes.subscribe(slaveNodes => { 
            this.nodesData = slaveNodes;
        })
    }
}