import { MongooseChartDataset } from "./mongoose-chart-dataset.model";
import { MongooseChartOptions } from "./mongoose-chart-options";

export interface MongooseChart { 
chartOptions: MongooseChartOptions;
chartLabels: string[];
chartType: string;
chartLegend: boolean;
chartData: MongooseChartDataset; 
}