import { ActivatedRoute, Params } from "@angular/router";
import { Observable } from "rxjs";
import { RouteParams } from "src/app/modules/app-module/Routing/params.routes";
import { MonitoringApiService } from "../services/monitoring-api/monitoring-api.service";
import { MongooseRunRecord } from "./run-record.model";

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
