// NOTE: Internal metric names are being used in order to be independent from ...
// ... names of metrics within third-party services like Prometheus.

export class InternalMetricNames { 
    static readonly LATENCY_MAX = "latency_max";
    static readonly LATENCY_MIN = "latency_min";    

    static readonly MEAN_DURATION = "mean_duration";
    static readonly MIN_DURATION = "min_duration";
    static readonly MAX_DURATION = "max_duration";


    static readonly BANDWIDTH = "bandwidth";
    static readonly FAILED_OPERATIONS = "failed_operations";
    static readonly SUCCESSFUL_OPERATIONS = "successful_operations";
}