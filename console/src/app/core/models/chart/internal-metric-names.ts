/**
 * Internal metric names are being used in order to be independent from ...
 * ... names of metrics within third-party services like Prometheus.
 */
export class InternalMetricNames { 
    static readonly LATENCY_MAX = "latency_max";
    static readonly LATENCY_MIN = "latency_min";    
    static readonly LATENCY_MEAN = "latency_mean";

    static readonly MEAN_DURATION = "mean_duration";
    static readonly MIN_DURATION = "min_duration";
    static readonly MAX_DURATION = "max_duration";

    static readonly BANDWIDTH_MEAN = "bandwidth_mean";
    static readonly BANDWIDTH_LAST = "bandwidth_last";

    static readonly FAILED_OPERATIONS_MEAN = "failed_operations_mean";
    static readonly FAILED_OPERATIONS_LAST = "failed_operations_last";

    static readonly SUCCESSFUL_OPERATIONS_MEAN = "successful_operations_mean";
    static readonly SUCCESSFUL_OPERATIONS_LAST = "successful_operations_last";

}