export class PrometheusConfigurationEditor { 
    
    private readonly TARGETS_PROPERTY_NAME = "targets"; 
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

    private addQuotesToList(list: String[]): String[] { 
        list.forEach((target, index) => { 
            target = target.trim(); 
            if (target[0] != "'") { 
              target = `'${target}`;
            }
            if (target[target.length] != "'") { 
              target += "'";
            }
            list[index] = target;
            return target; 
          });

          return list; 
    }

    private getUpdatedTargetsValue(targets: String[]): String { 
        targets = this.addQuotesToList(targets); 
        return `${this.TARGETS_PROPERTY_NAME}:[${targets}]`
    }
}