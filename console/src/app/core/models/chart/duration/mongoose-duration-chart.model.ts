import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { formatDate } from "@angular/common";
import { MongooseMetric } from "../mongoose-metric.model";
import { InternalMetricNames } from "../internal-metric-names";

export class MongooseDurationChart implements MongooseChart {

    private readonly DURATION_DATASET_INDEX = 0;

    chartOptions: MongooseChartOptions;
    chartLabels: string[];
    chartType: string;
    chartLegend: boolean;
    chartData: MongooseChartDataset[];
    mongooseChartDao: MongooseChartDao;
    isChartDataValid: boolean;

    constructor(chartOptions: MongooseChartOptions, chartLabels: string[], chartType: string, chartLegend: boolean, mongooseChartDao: MongooseChartDao) {
        this.chartOptions = chartOptions;
        this.chartLabels = chartLabels;
        this.chartType = chartType;
        this.chartLegend = chartLegend;
        this.mongooseChartDao = mongooseChartDao;
        this.isChartDataValid = true;

        let durationChartDatasetInitialValue = new MongooseChartDataset([], 'Mean duration');
        var durationChartDataset: MongooseChartDataset[] = [];
        durationChartDataset.push(durationChartDatasetInitialValue);
        this.chartData = durationChartDataset;
    }

    updateChart(recordLoadStepId: string, metrics: MongooseMetric[]) {
        let durationMetricName = InternalMetricNames.DURATION; 
        console.log(`Update duration chart with array length: ${metrics.length}`);
        metrics.forEach(durationMetric => {
            if (durationMetric.getName() != durationMetricName) { 
                return; 
            }
            this.chartData[this.DURATION_DATASET_INDEX].appendDatasetWithNewValue(durationMetric.getValue());
    
            this.chartLabels.push(formatDate(Math.round(durationMetric.getTimestamp() * 1000), 'mediumTime', 'en-US'));
            if (this.shouldScaleChart()) {
                this.chartData[this.DURATION_DATASET_INDEX].data.shift();
                this.chartLabels.shift();
            }
        })

    }

    public shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return (this.chartLabels.length >= maxAmountOfPointsInGraph);
    }

}
