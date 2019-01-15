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
        static readonly MONGOOSE_PROXY_PASS = "localhost:4033" // PROD: '/config', DEBUG: 'localhost:9999'
    }
}