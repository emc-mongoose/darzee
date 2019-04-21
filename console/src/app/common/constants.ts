import { HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment"; 


export namespace Constants {

    // NOTE: Default filenames for files saved via UI
    export class FileNames {
        static readonly SCENARIO_FILE_NAME = "scenario_dummy";
        static readonly CUSTOM_CONFIGURATION_FILENAME = "aggregated_defaults";
        static readonly PROMETHEUS_CONFIGURATION = "prometheus";
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
        // TODO: Fetch Mongoose port from .env file 
        static readonly MONGOOSE_PORT = `${environment.mongoosePort}`
        // TODO: Figure out how to run on multiple nodes 
        static MONGOOSE_HOST_IP = `${environment.mongooseIp}:` + `${environment.mongoosePort}`

        // TODO: read port from .env file 
        static readonly PROMETHEUS_IP = `${environment.prometheusIp}:${environment.prometheusPort}`

        static readonly CONTAINER_SERVER_PORT = `${environment.nodeJsServerPort}`;
    }

    export class Http {

        static readonly JSON_CONTENT_TYPE = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        static readonly HEADER_ACCEPT_JSON = { 
            headers: new HttpHeaders({'Accept:' : 'application/json' })
        }

        static readonly UNSTRUCTURED_DATA_TYPE = {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
        };

        static readonly EMPTY_POST_REQUEST_HEADERS = {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
        }

        static readonly HTTP_PREFIX = "http://";
    }

    export class HttpStatus {
        static readonly CONFLICT = 409;
    }
}