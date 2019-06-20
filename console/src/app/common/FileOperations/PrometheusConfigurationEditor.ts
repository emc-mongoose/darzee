// NOTE: class should edit Prometheus' configuration. It was created because ...
// ... I haven't found a good TypeScript-cpmpatible library to parse .yml file. 

export class PrometheusConfigurationEditor {

    private readonly GLOBAL_SECTION_NAME: string = "global";
    private readonly TARGETS_PROPERTY_NAME: string = "targets";
    private readonly SCRAPE_INTERVAL_PROPERTY_NAME: string = "scrape_interval";
    private readonly SCRAPE_TIMEOUT_PROPERTY_NAME: string = "scrape_timeout";

    private readonly CONFIGURATION_FIELD_AND_VALUE_DELIMITER: string = "  ";
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

    /**
     * Changes scrape interval in Prometheus' configuration. 
     * Note: it changes the scrape interval value only within the first found field since it's usually global.
     * @param prometheusConfiguration Prometheus' configuration.
     * @param periodOfScrapeSecs Period of data scraping to be set into the configuration.
     * @returns updated Prometheus configuration.
     */
    public changeScrapeInterval(prometheusConfiguration: String, periodOfScrapeSecs: number): String {
        const periodOfScrapeSecondsPropertyValue: string = `${periodOfScrapeSecs}s`;
        var updatedConfiguration: String = "";
        try {
            updatedConfiguration = this.changeLastFoundPropertyValue(prometheusConfiguration, this.SCRAPE_INTERVAL_PROPERTY_NAME, periodOfScrapeSecondsPropertyValue);
        } catch (propertyNotFoundError) {
            // NOTE: Appending scrape interval value into configuration if not found.
            let globalSectionNameWithDelimiter: string = `${this.GLOBAL_SECTION_NAME}:`;
            updatedConfiguration = this.addPropertyToSection(prometheusConfiguration, globalSectionNameWithDelimiter, this.SCRAPE_INTERVAL_PROPERTY_NAME, periodOfScrapeSecondsPropertyValue);
        }
        return updatedConfiguration;
    }


    /**
     * Changes scrape timeout in Prometheus' configuration. 
     * Note: it changes the scrape interval value only within the first found field since it's usually global.
     * @param prometheusConfiguration Prometheus' configuration.
     * @param scrapeTimeoutSecs Period of data scrape request timeout to be set into the configuration.
     * @returns updated Prometheus configuration.
     */
    public changeScrapeTimeout(prometheusConfiguration: String, scrapeTimeoutSecs: number): String {
        const scrapeTimeoutSecondsPropertyValue: string = `${scrapeTimeoutSecs}s`;
        var updatedConfiguration: String = "";
        try {
            updatedConfiguration = this.changeLastFoundPropertyValue(prometheusConfiguration, this.SCRAPE_TIMEOUT_PROPERTY_NAME, scrapeTimeoutSecondsPropertyValue);
        } catch (propertyNotFoundError) {
            // NOTE: Appending scrape timeout value into configuration if not found.
            let globalSectionNameWithDelimiter: string = `${this.GLOBAL_SECTION_NAME}:`;
            updatedConfiguration = this.addPropertyToSection(prometheusConfiguration, globalSectionNameWithDelimiter, this.SCRAPE_TIMEOUT_PROPERTY_NAME, scrapeTimeoutSecondsPropertyValue);
        }
        return updatedConfiguration;
    }

    // MARK: - Private 

    /**
     * Changes value of last found property with a specified name.
     * @param prometheusConfiguration processing Prometheus configuration.
     * @param propertyName name of property for chaning. IMPORTANT: Name should be provided WITH the postfix if needed. (e.g.: "10s" should be provided as "10s", not just "10").
     * @param propertyValue updated property value.
     * @throws Error if property hasn't been found in configuration.
     * @returns configuration with updated property value.
     */
    private changeLastFoundPropertyValue(prometheusConfiguration: String, propertyName: string, propertyValue: string): String {
        const startIndexOfPropetySection: number = prometheusConfiguration.toString().lastIndexOf(propertyName);

        const propertyNotFoundIndex: number = - 1;
        const hasFoundProperty: boolean = (startIndexOfPropetySection != propertyNotFoundIndex);
        if (!hasFoundProperty) {
            throw new Error(`Property ${propertyName} hasn't been found in Prometheus' configuration.`);
        }
        // NOTE: Inserting updated value between startIndex and endIndex.
        var updatedConfiguration: string = prometheusConfiguration.substring(0, startIndexOfPropetySection);

        const newPropertyValue: string = `${propertyName}:${this.CONFIGURATION_FIELD_AND_VALUE_DELIMITER}${propertyValue}\n`;
        updatedConfiguration += newPropertyValue;

        // NOTE: currentIndexOfPropertySection points to the index of currently processing symbol within string.
        const remainingPartOfConfiguration: string = prometheusConfiguration.substring(startIndexOfPropetySection, prometheusConfiguration.length);
        var endIndexOfPropertySection: number = startIndexOfPropetySection + this.getAmountOfCharactersUntilEndOfLine(remainingPartOfConfiguration);

        const lastIndexOfProvidedConfiguration: number = prometheusConfiguration.length;
        const secondPartOfConfiguration: string = prometheusConfiguration.substring(endIndexOfPropertySection, lastIndexOfProvidedConfiguration);

        // NOTE: Appending updated part with the rest of the configuration.
        updatedConfiguration += secondPartOfConfiguration;
        return updatedConfiguration;
    }


    /**
     * Appends YAML's section with a "proprty: value" pair.
     * @param yamlConfiguration yaml file content.
     * @param sectionName - target section name;
     * @param propertyName - appending property name;
     * @param propertyValue - appending property value;
     * @throws Error if section not found;
     * @returns configuration with appended section.
     * WARNING: Doesn't work with commented-out lines.
     */
    private addPropertyToSection(yamlConfiguration: String, sectionName: string, propertyName: string, propertyValue: string): String {
        const startIndexOfTargetSection: number = yamlConfiguration.toString().lastIndexOf(sectionName);

        const sectionNotFoundIndex: number = -1;
        if (startIndexOfTargetSection == sectionNotFoundIndex) {
            throw new Error(`Section ${sectionName} hasn't been found within given configuration: ${yamlConfiguration}.`);
        }

        const endOfLineSymbol: string = "\n";
        // NOTE: Calculating intent in order to insert a "property: value" pair into a section correctly.
        var amountOfWhiteSpacesInIntent: number = 0;
        for (var processingSymbolIndex: number = startIndexOfTargetSection; processingSymbolIndex > 0; processingSymbolIndex--) {
            const previousChar: string = yamlConfiguration[processingSymbolIndex];
            amountOfWhiteSpacesInIntent++;
            if (previousChar == endOfLineSymbol) {
                break;
            }
        }

        const processingSection: string = yamlConfiguration.substring(startIndexOfTargetSection, yamlConfiguration.length);
        const endIndexOfTargetSection: number = startIndexOfTargetSection + this.getAmountOfCharactersUntilEndOfLine(processingSection);

        const firstPartOfConfiguration: string = yamlConfiguration.substring(0, endIndexOfTargetSection);
        // NOTE: Creating intent with whitespaces.
        const newPropertyIntent: String = new Array(amountOfWhiteSpacesInIntent + 1).join(" ");

        // NOTE: Getting the second part of originally provided configuration.
        const secondPartOfConfiguration: string = yamlConfiguration.substring(endIndexOfTargetSection, yamlConfiguration.length);
        const newProperty: string = `${newPropertyIntent}${propertyName}:${this.CONFIGURATION_FIELD_AND_VALUE_DELIMITER}${propertyValue}\n`;

        const configurationWithNewProperty = firstPartOfConfiguration + newProperty + secondPartOfConfiguration;
        return configurationWithNewProperty;
    }

    private getAmountOfCharactersUntilEndOfLine(targetString: string): number {
        var hasReachedEndOfLine: boolean = false;
        // NOTE: currentIndexOfPropertySection points to the index of currently processing symbol within string.
        var amountOfCharsUntilEndOfLine: number = 0;
        const endOfLineSymbol: string = "\n";
        while (!hasReachedEndOfLine) {
            let nextChar: string = targetString[amountOfCharsUntilEndOfLine]
            amountOfCharsUntilEndOfLine++;
            hasReachedEndOfLine = (nextChar == endOfLineSymbol);
        }
        return amountOfCharsUntilEndOfLine;
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
        // NOTE: Targets property and value must retain delimiter. Prometheus will crash otherwise.
        return `${this.TARGETS_PROPERTY_NAME}:${this.CONFIGURATION_FIELD_AND_VALUE_DELIMITER}[${targets}]`
    }
}