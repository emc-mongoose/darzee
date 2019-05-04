import { MongooseChartDao } from "./mongoose-chart-interface/mongoose-chart-dao.mode";
import { MongooseDurationChart } from "./mongoose-duration-chart.model";
import { MongooseChartOptions } from "./mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "./mongoose-chart-interface/mongoose-chart-dataset.model";

export class MongooseChartsRepository { 
    private mongooseChartDao: MongooseChartDao;

    private durationChart: MongooseDurationChart; 

    constructor(mongooseChartDao: MongooseChartDao) { 
        this.mongooseChartDao = mongooseChartDao; 
        this.setUpCharts();

    }

    // MARK: - Public 
    public getDurationChart(): MongooseDurationChart { 
        return this.durationChart; 
    }

    // MARK: - Private 
    
    private setUpCharts() { 
        this.durationChart = this.generateMongooseDurationChart(); 
    
    }

    private generateMongooseDurationChart(): MongooseDurationChart { 
        let durationChartOptions = new MongooseChartOptions(); 
        let durationChartLabels: string[] = []; 
        let durationChartType = "line";
        let durationChartLegend = true; 
  
        let durationChartDatasetInitialValue = new MongooseChartDataset([], 'Byte per second');
        var durationChartDataset: MongooseChartDataset[] = []; 
        durationChartDataset.push(durationChartDatasetInitialValue);
        return new MongooseDurationChart(durationChartOptions, durationChartLabels, durationChartType, durationChartLegend, durationChartDataset, this.mongooseChartDao);
    }
}