// A class that describes endpoints for Mongoose API. 
// See Mongoose API (as for 27.03.2019): ...
// ... https://github.com/emc-mongoose/mongoose-base/tree/master/doc/interfaces/api/remote

export namespace MongooseApi {

    // NOTE: API for configuration.
    export class Config {
        public static readonly CONFIG = "/config";
    }

    // NOTE: API for configuring Mongoose Run. 
    export class RunApi {
        public static readonly RUN_ENDPOINT = "run";
    }

    // NOTE: API to process Mongoose's Run logs 
    export class LogsApi {
        public static readonly LOGS = "/logs";
    }

    export class Headers { 
        // NOTE: ETAG is a Mongoose Run ID
        public static readonly ETAG = "etag";
    }
}
