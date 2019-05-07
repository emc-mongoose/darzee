import { MonitoringApiService } from "../services/monitoring-api/monitoring-api.service";
import { Params } from "@angular/router";
import { Observable } from "rxjs";
import { MongooseRunRecord } from "./mongoose-run-record/run-record.model";
import { RouteParams } from "src/app/modules/app-module/Routing/params.routes";

export class MongooseRouteParamsParser {

    constructor(private monitoringApiService: MonitoringApiService) { }

    public getMongooseRunRecordByLoadStepId(params: Params): Observable<MongooseRunRecord> {
        let targetRecordLoadStepId = params[RouteParams.ID];
        if (targetRecordLoadStepId == undefined) {
            throw new Error(`Unable to get load step ID from parameters: ${JSON.stringify(params)}`);
        }
        return this.monitoringApiService.getMongooseRunRecordByLoadStepId(targetRecordLoadStepId);
    }
}