import { MongooseChartDataset } from "./mongoose-chart-dataset.model";
import { MongooseChartOptions } from "./mongoose-chart-options";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { MongooseMetric } from "../mongoose-metric.model";
import { MetricValueType } from "./metric-value-type";
import { NumbericMetricValueType } from "./numeric-metric-value-type";

export interface MongooseChart {
    chartOptions: MongooseChartOptions;
    chartLabels: string[];
    chartType: string;
    chartLegend: boolean;
    // TODO: Change back to MongooseChartDataset[]
    chartData: any[];

    //     chartData: MongooseChartDataset[];

    isChartDataValid: boolean;
    shouldShiftChart: boolean; 

    mongooseChartDao: MongooseChartDao;
    // TODO: Change updateChart(...) method back to normal.
    /**
     * 
     * @param recordLoadStepId load step ID of metrics provided for chart.
     * @param metrics array of data for chart.
     * @param metricType type of metric (e.g.: min, mean, max, last, etc.)
     */
    updateChart(recordLoadStepId: string, metrics: any[], metricType?: MetricValueType | NumbericMetricValueType);
    //     updateChart(recordLoadStepId: string, metrics: MongooseMetric[]);

    shouldDrawChart(): boolean;
}
