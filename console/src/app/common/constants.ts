import { HttpHeaders } from "@angular/common/http";

export namespace Constants { 

    // NOTE: Default filenames for files saved via UI
    export class FileNames { 
        static readonly SCENARIO_FILE_NAME = "scenario_dummy";
        static readonly CUSTOM_CONFIGURATION_FILENAME = "aggregated_defaults"
    }
    
    export class Alerts { 
        // Common 
        static readonly SERVER_DATA_NOT_AVALIABLE = "Unable to fetch configuration from the server.";
        static readonly FILE_SAVED = "File has been saved.";
        static readonly FILE_NOT_EDITED = "File couldn't be saved because it hasn't been edited.";
        static readonly MONGOOSE_HAS_STARTED = "Mongoose has started.";
        // Configuration editing 
        static readonly NEW_CONFIG_APPLIED = "New configuration has been applied.";

    }

    export class Placeholders { 
        // Scenarious editing 
        static readonly CODE_EDITOR_PLACEHOLDER = "Select Javascript file.."; 
    }

    export class Configuration { 
        // TODO: Figure out how to run on multiple nodes 
        static readonly MONGOOSE_HOST_IP = "localhost:9999" 

        // TODO: read port from .env file 
        static readonly PROMETHEUS_PORT = 9090;
        static readonly PROMETHEUS_IP = "localhost:" + Constants.Configuration.PROMETHEUS_PORT; 
    }

    export class Http { 
        
        static readonly JSON_CONTENT_TYPE = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
          };

          static readonly HTTP_PREFIX = "http://";
    }
}