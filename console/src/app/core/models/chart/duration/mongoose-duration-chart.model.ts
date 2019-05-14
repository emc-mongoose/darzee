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
    shouldShiftChart: boolean;


    constructor(chartOptions: MongooseChartOptions, chartLabels: string[], chartType: string, chartLegend: boolean, mongooseChartDao: MongooseChartDao, shouldShiftChart: boolean = false) {
        this.chartOptions = chartOptions;
        this.chartLabels = chartLabels;
        this.chartType = chartType;
        this.chartLegend = chartLegend;
        this.mongooseChartDao = mongooseChartDao;
        this.isChartDataValid = true;
        this.shouldShiftChart = shouldShiftChart;

        let durationChartDatasetInitialValue = new MongooseChartDataset([], 'Mean duration');
        var durationChartDataset: MongooseChartDataset[] = [];
        durationChartDataset.push(durationChartDatasetInitialValue);
        this.chartData = durationChartDataset;
    }

    updateChart(recordLoadStepId: string, metrics: MongooseMetric[]) {
        let durationMetricName = InternalMetricNames.DURATION;
        var updatedData: any[] = [];
        var updatedLabels: any[] = [];
        metrics.forEach(durationMetric => {
            if (durationMetric.getName() != durationMetricName) {
                return;
            }

//            let x = Number(durationMetric.getValue());
  //          let y = Number(durationMetric.getTimestamp());
    //        console.log(`x: ${x}, y: ${y}`);
      //      this.chartData[this.DURATION_DATASET_INDEX].addPoint(y, x);

            updatedLabels.push(formatDate(Math.round(durationMetric.getTimestamp() * 1000), 'mediumTime', 'en-US'));
            updatedData.push(durationMetric.getValue());
        })
        this.chartLabels = updatedLabels;
         this.chartData[this.DURATION_DATASET_INDEX].setChartData(updatedData);

    }

    public shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return ((this.chartLabels.length >= maxAmountOfPointsInGraph) && this.shouldShiftChart);
    }

}
