export class PrometheusConfigurationEditor { 
    
    private readonly TARGETS_PROPERTY_NAME = "targets"; 
    private readonly TARGET_LIST_ELEMENTS_SURROUNDING_CHARACTERS = "'";

    prometheusConfigurationFileContent: Object; 

    constructor(prometheusConfigurationFileContent: Object) { 
        this.prometheusConfigurationFileContent = prometheusConfigurationFileContent; 
    }

    public addTargetsToConfiguration(targets: String[]): String { 
        var processingConfiguration: String = this.prometheusConfigurationFileContent.toString(); 

        let startIndexOfTargetsSection = processingConfiguration.toString().lastIndexOf(this.TARGETS_PROPERTY_NAME); 

        let isEndOfLine = false;         
        var endIndexOfTargetsSection = startIndexOfTargetsSection; 
        while (!isEndOfLine) { 
          let nextChar = processingConfiguration[endIndexOfTargetsSection + 1]; 
          endIndexOfTargetsSection++; 
          isEndOfLine = (nextChar == "\n"); 
        }
  
        let firstPartOfConfiguration = processingConfiguration.substring(0, startIndexOfTargetsSection); 
        firstPartOfConfiguration += this.getUpdatedTargetsValue(targets);
        let secondPartOfConfiguration = processingConfiguration.substring(endIndexOfTargetsSection, processingConfiguration.length);
        let finalConfiguration = firstPartOfConfiguration + secondPartOfConfiguration; 
    
        console.log(`updated configuration: ${finalConfiguration}`);
        return finalConfiguration;
  
    }

    private surroundListItemsWithCharacter(list: String[], character: String): String[] { 
        list.forEach((target, index) => { 
            target = target.trim(); 
            if (target[0] != character) { 
              target = `${character}${target}`;
            }
            if (target[target.length] != character) { 
              target = `${target}${character}`;
            }
            list[index] = target;
            return target; 
          });

          return list; 
    }

    private getUpdatedTargetsValue(targets: String[]): String { 
        targets = this.surroundListItemsWithCharacter(targets, this.TARGET_LIST_ELEMENTS_SURROUNDING_CHARACTERS); 
        return `${this.TARGETS_PROPERTY_NAME}:[${targets}]`
    }
}