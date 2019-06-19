// NOTE: class should edit Prometheus' configuration. It was created because ...
// ... I haven't found a good TypeScript-cpmpatible library to parse .yml file. 

export class PrometheusConfigurationEditor {

    private readonly TARGETS_PROPERTY_NAME = "targets";
    private readonly SCRAPE_INTERVAL_PROPERTY_NAME = "scrape_interval";
    private readonly TARGET_LIST_ELEMENTS_SURROUNDING_CHARACTERS = "'";

    public prometheusConfigurationFileContent: Object;

    // MARK: - Lifecycle 

    constructor(prometheusConfigurationFileContent: Object) {
        this.prometheusConfigurationFileContent = prometheusConfigurationFileContent;
    }

    // MARK: - Public 

    /**
     * Appends Prometheus' configuration with new targets.
     * @param targets targets to be appened into the configuration.
     * @returns appended configuration.
     */
    public addTargetsToConfiguration(targets: String[]): String {
        var processingConfiguration: String = this.prometheusConfigurationFileContent.toString();

        let startIndexOfTargetsSection: number = processingConfiguration.toString().lastIndexOf(this.TARGETS_PROPERTY_NAME);

        let isEndOfLine: boolean = false;
        var endIndexOfTargetsSection: number = startIndexOfTargetsSection;
        while (!isEndOfLine) {
            let nextChar = processingConfiguration[endIndexOfTargetsSection + 1];
            endIndexOfTargetsSection++;
            isEndOfLine = (nextChar == "\n");
        }

        let firstPartOfConfiguration = processingConfiguration.substring(0, startIndexOfTargetsSection);
        firstPartOfConfiguration += this.getUpdatedTargetsValue(targets);
        let secondPartOfConfiguration = processingConfiguration.substring(endIndexOfTargetsSection, processingConfiguration.length);
        let finalConfiguration = firstPartOfConfiguration + secondPartOfConfiguration;

        return finalConfiguration;
    }

    public changeScrapeInterval(prometheusConfiguration: String, periodOfScrapeSecs: number): String {
        const periodOfScrapeSecondsPropertyValue: string = `${periodOfScrapeSecs}s`;
        return this.changeFirstFoundPropertyValue(prometheusConfiguration, this.SCRAPE_INTERVAL_PROPERTY_NAME, periodOfScrapeSecondsPropertyValue);
    }


    // MARK: - Private 

    /**
     * Changes value of property that was first to be found by provided name.
     * @param prometheusConfiguration processing Prometheus configuration.
     * @param propertyName name of property for chaning. IMPORTANT: Name should be provided WITH the postfix if needed. (e.g.: "10s" should be provided as "10s", not just "10").
     * @param propertyValue updated property value.
     * @returns configuration with updated property value.
     */
    private changeFirstFoundPropertyValue(prometheusConfiguration: String, propertyName: string, propertyValue: string): String {
        const startIndexOfPropetySection: number = prometheusConfiguration.toString().lastIndexOf(propertyName);

        var hasReachedEndOfLine: boolean = false;
        // NOTE: currentIndexOfPropertySection points to the index of currently processing symbol within string.
        var endIndexOfPropertySection: number = startIndexOfPropetySection;
        const endOfLineSymbol: string = "\n";
        while (!hasReachedEndOfLine) {
            let nextChar: string = prometheusConfiguration[endIndexOfPropertySection]
            endIndexOfPropertySection++;
            hasReachedEndOfLine = (nextChar == endOfLineSymbol);
        }

        // NOTE: Inserting updated value between startIndex and endIndex.
        var updatedConfiguration: string = prometheusConfiguration.substring(0, startIndexOfPropetySection);

        const newPropertyValue: string = `${propertyName}:${propertyValue}\n`;
        updatedConfiguration += newPropertyValue;

        const lastIndexOfProvidedConfiguration: number = prometheusConfiguration.length;
        const secondPartOfConfiguration: string = prometheusConfiguration.substring(endIndexOfPropertySection, lastIndexOfProvidedConfiguration);

        // NOTE: Appending updated part with the rest of the configuration.
        updatedConfiguration += secondPartOfConfiguration;
        console.log(`Provided configuration: ${prometheusConfiguration}. Updated configuration: ${updatedConfiguration}`);
        return updatedConfiguration;
    }

    private surroundListItemsWithCharacter(list: String[], character: String): String[] {
        list.forEach((target, index) => {
            target = target.trim();
            if (target[0] != character) {
                target = `${character}${target}`;
            }
            if (target[target.length - 1] != character) {
                target = `${target}${character}`;
            }
            list[index] = target;
            return target;
        });
        return list;
    }

    private getUpdatedTargetsValue(targets: String[]): String {
        targets = this.surroundListItemsWithCharacter(targets, this.TARGET_LIST_ELEMENTS_SURROUNDING_CHARACTERS);
        let fieldNameAndValueDelimiter = "  "; // NOTE: prometheus.yml file delimiter contains 2 whitesapces
        // NOTE: Targets property and value must retain delimiter. Prometheus will crash otherwise.
        return `${this.TARGETS_PROPERTY_NAME}:${fieldNameAndValueDelimiter}[${targets}]`
    }
}