import { MongooseRunNode } from "./node/mongoose-run-node.model";

export class MongooseConfigurationParser {
    private configuration: any;

    constructor(mongooseConfiguration: any) {
        this.configuration = mongooseConfiguration;
    }

    // MARK: - Public 

    public getConfigurationWithAdditionalNodes(additionalNodes: MongooseRunNode[]): any {
        if (additionalNodes.length == 0) {
            return this.configuration;
        }
        if (!this.isSlaveNodesFieldExisInConfiguration(this.configuration)) {
            throw new Error(`Invalid Mongoose configuration structure.`);
        }

        var existingNodesInConfiguration = this.getNodes();;

        additionalNodes.forEach(node => {
            let nodeAddress = node.getResourceLocation();
            existingNodesInConfiguration.push(nodeAddress);
        })

        let configurationWithAdditionalNodes: any = this.configuration;
        configurationWithAdditionalNodes.load.step.node.addrs = existingNodesInConfiguration;
        return configurationWithAdditionalNodes;
    }

    public getNodes(): string[] {
        // NOTE: Returning slave nodes as string array since we're retrieving ...
        // ... it from JSON. As for now, we don't care about its resource locator ...
        // ... type.   
        let existingConfiguration: any = this.configuration;
        if (!this.isSlaveNodesFieldExisInConfiguration(existingConfiguration)) {
            throw new Error(`Required nodes field doesn't exist in Mongoose configuration.`)
        }
        return existingConfiguration.load.step.node.addrs;
    }

    // MARK: - Private 

    private isSlaveNodesFieldExisInConfiguration(configuration: any): boolean {
        // NOTE: Check if 'Address' field exists on received Mongoose JSON configuration. 
        // As for 04.03.2019, it's located at load -> step -> node -> addrs
        return !((configuration.load == undefined) &&
            (configuration.load.step == undefined) &&
            (configuration.load.step.node == undefined) &&
            (configuration.load.step.node.addrs == undefined));
    }


}