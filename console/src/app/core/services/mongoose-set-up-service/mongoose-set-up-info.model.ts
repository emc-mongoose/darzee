import { MongooseRunNode } from "../../models/mongoose-run-node.model";
import { ResourceLocatorType } from "../../models/address-type";

export class MongooseSetupInfoModel {

    private readonly DEFAULT_RESOURCE_TYPE_FOR_NODE: ResourceLocatorType = ResourceLocatorType.IP;

    private runNodes: MongooseRunNode[];
    private configuration: any; // NOTE: Configuration is represented with JSON 
    private runScenario: String; // NOTE: As for 22.02.2019, 'Scenario' is a JavaScript code
    private loadStepId: String = "";

    private readonly DEFAULT_CONFIGURATION = "";
    private readonly DEFAULT_SCENARIO = "Load.run();";

    // MARK: - Constructor
    constructor(runNodes: MongooseRunNode[] = [], configuration: any = undefined, runScenario: String = "") {
        this.runNodes = runNodes;
        this.configuration = configuration;
        this.runScenario = runScenario;

        if (this.configuration == undefined) {
            this.configuration = this.DEFAULT_CONFIGURATION;
        }

        if (runScenario = "") {
            this.runScenario = this.DEFAULT_SCENARIO;
        }
    }

    // MARK: Getters & Setters

    public setLoadStepId(loadStepId: String) {
        this.loadStepId = loadStepId;
    }

    public getTargetRunPort(): String {
        let targetPort = "";
        try {
            targetPort = this.configuration.run.port;
        } catch (error) {
            let misleadingMsg = "Unable to get Mongoose Run target port from configuration."
            console.error(misleadingMsg);
        }
        return targetPort;
    }

    public getLoadStepId(): String {
        return this.configuration.load.step.id;
    }

    public setConfiguration(configuration: any) {
        this.configuration = configuration;
    }

    public getFullRunNodesList(): MongooseRunNode[] {
        return this.runNodes;
    }

    /**
     * @returns nodes' adrresses excluding @param entryNode's one.
     */
    public getSlaveNodesList(entryNode: MongooseRunNode): MongooseRunNode[] {
        return this.runNodes.filter(node => { return (entryNode.getResourceLocation() != node.getResourceLocation()) });
    }

    public getConfiguration(): any {
        return this.configuration;
    }

    public getRunScenario(): String {
        return this.runScenario;
    }

    public getStringifiedNodesForDistributedMode(): string[] {
        let stringfiedRunNodes: string[] = [];
        this.runNodes.forEach(runNode => {
            let nodeAddress: string = runNode.toString() as string;
            stringfiedRunNodes.push(nodeAddress);
        });
        return stringfiedRunNodes;
    }

    public setRunScenario(scenario: String) {
        this.runScenario = scenario;
    }

    /**
     * Adds multiple nodes into Mongoose's run configuration INCLUDING the entry node.
     * @param runNodesResourceLocations addresses of run nodes.
     */
    public setRunNodes(runNodesResourceLocations: string[]) {
        runNodesResourceLocations.forEach(runNodeResource => {
            let retrievedRunNode = new MongooseRunNode(runNodeResource, this.DEFAULT_RESOURCE_TYPE_FOR_NODE);
            this.runNodes.push(retrievedRunNode);
        })
    }

    // MARK: - Public 

    public hasLoadStepId(): boolean {
        let loadStepId = this.configuration.load.step.id;
        let emptyValue = "";
        return ((loadStepId != undefined) && (loadStepId != emptyValue));
    }

    public addRunNode(runNode: MongooseRunNode) {
        if (!this.isNodeAlreadyExist(runNode)) {
            this.runNodes.push(runNode);
        }
    }

    public removeRunNode(runNode: MongooseRunNode) {
        this.runNodes = this.runNodes.filter(node => {
            return (node.getResourceLocation() != runNode.getResourceLocation());
        })
    }

    public isNodeAlreadyExist(node: MongooseRunNode) {
        let isNodeExist = false;
        this.runNodes.forEach(savedNode => {
            isNodeExist = ((savedNode.getResourceLocation() == node.getResourceLocation()) && (savedNode.getResourceType() == savedNode.getResourceType()));
            if (isNodeExist) {
                return;
            }
        });
        return isNodeExist;
    }
    // MARK: - Private 


}