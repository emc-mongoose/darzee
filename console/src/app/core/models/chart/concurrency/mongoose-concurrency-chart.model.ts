import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { MongooseTestChartDataset } from "../mongoose-chart-interface/mongoose-test-chart-dataset.model";
import { ChartPoint } from "../mongoose-chart-interface/chart-point.model";
import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";

/**
 * Concurrency chart for BasicChart component.
 */
export class MongooseConcurrencyChart implements MongooseChart { 

    /**
     * Make sure to update @param LAST_CONCURRENT_METRICS_DATASET_INDEX, @param MEAN_CONCURRENT_METRICS_DATASET_INDEX in case ...
     * ... @param chartData order changes.
     * @param LAST_CONCURRENT_METRICS_DATASET_INDEX index of data array for "concurrent_last" metrics chart
     * @param MEAN_CONCURRENT_METRICS_DATASET_INDEX index of data array for "concurrent_mean" metrics chart
     */
    private readonly LAST_CONCURRENT_METRICS_DATASET_INDEX = 0;
    private readonly MEAN_CONCURRENT_METRICS_DATASET_INDEX = 1;

    chartOptions: MongooseChartOptions;
    chartLabels: string[];
    chartType: string;
    chartLegend: boolean;
    chartData: MongooseTestChartDataset[];

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

        let concurrencyLastDatasetInitialValue = new MongooseTestChartDataset([], 'Concurrency, last');
        let concurrentMeanDatasetInitialValue = new MongooseTestChartDataset([], "Concurrent, mean");

        var concurrencyChartDataset: MongooseTestChartDataset[] = [];
        concurrencyChartDataset.push(concurrencyLastDatasetInitialValue);
        concurrencyChartDataset.push(concurrentMeanDatasetInitialValue);

        this.chartData = concurrencyChartDataset;

        this.configureChartOptions();
    }

    updateChart(recordLoadStepId: string, metrics: ChartPoint[]) {

        this.chartData[0].data = metrics;
        let labels: string[] = [];
        for (var chartPoint of metrics) { 
            let timestamp = chartPoint.getX() as unknown; 
            labels.push(timestamp as string);
        }
        this.chartLabels = labels;


    }

    public shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return ((this.chartLabels.length >= maxAmountOfPointsInGraph) && this.shouldShiftChart);
    }

    private configureChartOptions() {

        let lightRedColorRgb: string = "rgb(255, 0, 0)";
        this.chartData[0].setChartColor(lightRedColorRgb);
        let chartTitle: string = "Mongoose's concurrent operations";
        this.chartOptions.setChartTitle(chartTitle);
    }
}