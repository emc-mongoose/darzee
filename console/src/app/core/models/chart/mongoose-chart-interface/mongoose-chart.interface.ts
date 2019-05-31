import { MongooseChartOptions } from "./mongoose-chart-options";
import { MetricValueType } from "./metric-value-type";
import { NumericMetricValueType } from "./numeric-metric-value-type";
import { ChartPoint } from "./chart-point.model";
import { MongooseChartDataset } from "./mongoose-chart-dataset.model";

export interface MongooseChart {
    chartOptions: MongooseChartOptions;
    chartLabels: string[];
    chartType: string;
    chartLegend: boolean;

    chartData: MongooseChartDataset[];

    isChartDataValid: boolean;
    shouldShiftChart: boolean;

    /**
     * 
     * @param recordLoadStepId load step ID of metrics provided for chart.
     * @param metrics array of chart points. ((x,y) values)
     * @param metricType type of metric (e.g.: min, mean, max, last, etc.)
     * @param additionalChartParameters additional parameters for chart (e.g.: specified type of operation, etc.)
     */
    updateChart(recordLoadStepId: string, metrics: ChartPoint[], metricType?: MetricValueType | NumericMetricValueType, ...additionalChartParameters: any);

    shouldDrawChart(): boolean;
}
