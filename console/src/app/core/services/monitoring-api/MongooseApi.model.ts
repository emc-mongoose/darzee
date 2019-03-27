// A class that describes endpoints for Mongoose API. 
// See Mongoose API (as for 27.03.2019): ...
// ... https://github.com/emc-mongoose/mongoose-base/tree/master/doc/interfaces/api/remote

export namespace MongooseApi { 

    export class RunApi { 
        public static readonly RUN = "/run";
    }

    export class LogsApi { 
        public static readonly LOGS = "/logs";
    }
}