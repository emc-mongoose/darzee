import { MongooseChartDataset } from "./mongoose-chart-dataset.model";
import { MongooseChartOptions } from "./mongoose-chart-options";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { MongooseMetric } from "../mongoose-metric.model";

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
    updateChart(recordLoadStepId: string, metrics: any[]);
    //     updateChart(recordLoadStepId: string, metrics: MongooseMetric[]);

    shouldDrawChart(): boolean;
}
