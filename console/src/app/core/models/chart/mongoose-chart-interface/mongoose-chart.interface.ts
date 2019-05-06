import { MongooseChartDataset } from "./mongoose-chart-dataset.model";
import { MongooseChartOptions } from "./mongoose-chart-options";
import { MongooseChartDao } from "./mongoose-chart-dao.mode";
import { MongooseMetric } from "../mongoose-metric.model";

export interface MongooseChart {
    chartOptions: MongooseChartOptions;
    chartLabels: string[];
    chartType: string;
    chartLegend: boolean;
    chartData: MongooseChartDataset[];
    isChartDataValid: boolean;

    mongooseChartDao: MongooseChartDao;
    updateChart(recordLoadStepId: string, metrics: MongooseMetric[]);
    shouldDrawChart(): boolean;
}