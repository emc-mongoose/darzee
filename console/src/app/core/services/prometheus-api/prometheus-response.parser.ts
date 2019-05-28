import { MongooseMetric } from "../../models/chart/mongoose-metric.model";

/**
 * Parses Prometheus' response on PromQL queries.
 */
export class PrometheusResponseParser {

    constructor() { }


    // MARK: - Public 
    
    public getMongooseMetricsArray(rawResponse: any): MongooseMetric[] {
        const emptyValue = [];

        if (rawResponse.length == 0) {
            return emptyValue;
        }

        var resultMetrics: MongooseMetric[] = [];
        let firstFoundMetricIndex = 0;

        let singleValuePrometheusResponseTag = "value";
        let multipleValuesPrometheusResponseTag = "values";

        var currentMetricValue = rawResponse[firstFoundMetricIndex][singleValuePrometheusResponseTag];
        if (currentMetricValue != undefined) {
            // NOTE: If Prometheus has responded with a single value (1d-array), return it. 
            return currentMetricValue[firstFoundMetricIndex];
        }

        let prometheusResponsePayloadIndex = 0;
        // NOTE: Data from Prometheus are coming in 2d-array, e.g.: [[timestamp, "value"]]
        const values = rawResponse[prometheusResponsePayloadIndex][multipleValuesPrometheusResponseTag];


        for (var metricIndex = 0; metricIndex < values.length; metricIndex++) {

            const timestampValueIndex = 0;
            const currentMetricTimestamp = values[metricIndex][timestampValueIndex];
            const metricValueIndex = 1;

            currentMetricValue = values[metricIndex][metricValueIndex];

            if (currentMetricValue == undefined) {
                return emptyValue;
            }

            let metricName: string = this.getMetricName(rawResponse);
            let mongooseMetric: MongooseMetric = new MongooseMetric(currentMetricTimestamp, currentMetricValue, metricName);
            resultMetrics.push(mongooseMetric);
        }

        return resultMetrics;
    }


    // MARK: - Private 

    public createFirstFoundMongooseMetricInstanceFromResponse(rawResponse: any): MongooseMetric {
        let metricValue = this.getMetricValueFromRawResponse(rawResponse);
        let timestampValue = this.getTimestampValueFromRawResponse(rawResponse);
        let metricName = this.getMetricName(rawResponse);
        return new MongooseMetric(timestampValue, metricValue, metricName);
    }


    private getMetricValueFromRawResponse(rawResponse: any): string {
        let metricValueIndex = 1;
        return this.getResultValueWithIndex(rawResponse, metricValueIndex);
    }

    private getTimestampValueFromRawResponse(rawResponse: any): number {
        let timestampValueIndex = 0;
        let timeStampAsString = this.getResultValueWithIndex(rawResponse, timestampValueIndex);
        return Number(timeStampAsString);
    }

    // NOTE: requiredValueIndex points at Prometheus' response index (e.g.: timestamp is at index 0, value is at index 0);
    private getResultValueWithIndex(rawResponse: any, requiredValueIndex: number): string {
        const emptyValue = "";

        if (rawResponse.length == 0) {
            return emptyValue;
        }

        let singleValuePrometheusResponseTag = "value";
        let multipleValuesPrometheusResponseTag = "values";

        let firstFoundMetricIndex = 0;
        var result = rawResponse[firstFoundMetricIndex][singleValuePrometheusResponseTag];
        if (result != undefined) {
            // NOTE: If Prometheus has responded with a single value (1d-array), return it. 
            return result[requiredValueIndex];
        }

        let resultValuesIndex = 0;
        // NOTE: Data from Prometheus are coming in 2d-array, e.g.: [[timestamp, "value"]]
        result = rawResponse[firstFoundMetricIndex][multipleValuesPrometheusResponseTag][resultValuesIndex][requiredValueIndex];
        if (result == undefined) {
            return emptyValue;
        }
        return result;
    }


    private getMetricName(rawResponse: any): string {
        const emptyValue = "";

        if (rawResponse.length == 0) {
            return emptyValue;
        }

        const metricTag = "metric";
        const firstFoundMetricIndex = 0;
        const firstFoundResponse = rawResponse[firstFoundMetricIndex][metricTag];

        if (firstFoundResponse == undefined) {
            throw new Error(`Unable to get "${metricTag}" field from Prometheus response. Response: ${JSON.stringify(rawResponse)}`);
        }

        const metricNameTag = "__name__";
        const metricName = firstFoundResponse[metricNameTag];

        if (metricName == undefined) {
            console.error(`Unable to find field ${metricNameTag} within Prometheus first found response. Response: ${firstFoundResponse}`);
            return emptyValue;
        }

        return metricName;
    }

}
