// NOTE: As for 26.03.2019, Mongoose uses Prometheus metrics. 
export namespace MongooseMetrics { 

    export class PrometheusMetrics { 
        public static readonly DURATION = "mongoose_duration_count";
    }
    
    // NOTE: Labels for a Prometheus metrics. 
    export class PrometheusMetricLabels { 
        public static readonly ID = "load_step_id";
    }
}