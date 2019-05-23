// NOTE: As for 26.03.2019, Mongoose uses Prometheus metric format. 
export namespace MongooseMetrics {

    // NOTE: Mongoose-exported metric names. 
    export class PrometheusMetrics {
        public static readonly DURATION = "mongoose_duration_count";
    }

    // NOTE: Labels for a Mongoose-exported Prometheus metric. 
    export class PrometheusMetricLabels {
        public static readonly ID = "load_step_id";
    }
}
