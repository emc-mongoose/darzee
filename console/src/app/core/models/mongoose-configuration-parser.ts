import { MongooseRunNode } from "./mongoose-run-node.model";

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

        // NOTE: Handling IPv4 addresses.
        const addressAndPortDelimiter: string = ":";
        // NOTE: Set configuration's RMI port as default for every node.
        const rmiPort: string = this.getRmiPortFromConfiguration(this.configuration);
        additionalNodes.forEach(node => {
            var nodeAddress = node.getResourceLocation();
            if (nodeAddress.includes(addressAndPortDelimiter)) {
                // NOTE: Pruning Mongoose remote API's port since we'll be using only RMI.
                const addressPartIndex: number = 0;
                nodeAddress = nodeAddress.split(addressAndPortDelimiter)[addressPartIndex];
                // NOTE: Appending configuration's RMI port to every node.
                nodeAddress += rmiPort; 
            }
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

    /**
     * Check if additional nodes field exists within given configuration.
     * @param configuration Mongoose's configuration
     */
    private isSlaveNodesFieldExisInConfiguration(configuration: any): boolean {
        // NOTE: Check if 'Address' field exists on received Mongoose JSON configuration. 
        // As for 04.03.2019, it's located at load -> step -> node -> addrs
        return !((configuration.load == undefined) &&
            (configuration.load.step == undefined) &&
            (configuration.load.step.node == undefined) &&
            (configuration.load.step.node.addrs == undefined));
    }


    /**
     * RMI is used to run Mongoose in distributed mode.
     * While POST requests should be sent to remote API port, ...
     * ... the requests for distributed run should be sent to RMI port.
     * @param configuration Mongoose's configuration
     * @returns RMI port from Mongoose configuration.
     */
    private getRmiPortFromConfiguration(configuration: any): string {
        // NOTE: Check if 'Address' field exists on received Mongoose JSON configuration. 
        // As for 18.06.2019, it's located at load -> step -> node -> addrs
        const isRmiPortFieldExistWithinConfiguration: boolean = !((configuration.load == undefined) &&
            (configuration.load.step == undefined) &&
            (configuration.load.step.node == undefined) &&
            (configuration.load.step.node.port == undefined));
        if (!isRmiPortFieldExistWithinConfiguration) {
            throw new Error(`Unable to find RMI port within given configuration: ${JSON.stringify(configuration)}`)
        }
        return configuration.load.step.node.port;
    }

}
