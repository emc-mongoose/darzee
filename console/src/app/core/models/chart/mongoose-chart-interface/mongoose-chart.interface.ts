import { MongooseChartOptions } from "./mongoose-chart-options";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { MongooseMetric } from "../mongoose-metric.model";
import { MetricValueType } from "./metric-value-type";
import { NumericMetricValueType } from "./numeric-metric-value-type";
import { ChartPoint } from "./chart-point.model";

export interface MongooseChart {
    chartOptions: MongooseChartOptions;
    chartLabels: string[];
    chartType: string;
    chartLegend: boolean;
    // TODO: Change back to MongooseChartDataset[]
    chartData: any[];

    isChartDataValid: boolean;
    shouldShiftChart: boolean;

    mongooseChartDao: MongooseChartDao;
    /**
     * 
     * @param recordLoadStepId load step ID of metrics provided for chart.
     * @param metrics array of data for chart.
     * @param metricType type of metric (e.g.: min, mean, max, last, etc.)
     */
    updateChart(recordLoadStepId: string, metrics: ChartPoint[] | MongooseMetric[], metricType?: MetricValueType | NumericMetricValueType, ...additionalChartParameters: any);

    shouldDrawChart(): boolean;
}
