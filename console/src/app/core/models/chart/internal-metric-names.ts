// NOTE: Internal metric names are being used in order to be independent from ...
// ... names of metrics within third-party services like Prometheus.

export class InternalMetricNames { 
    static readonly LATENCY_MAX = "latency_max";
    static readonly LATENCY_MIN = "latency_min";    
}