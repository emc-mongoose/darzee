import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Constants } from "src/app/common/constants";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

// NOTE: Prometheus configuration is being send via the Node.JS server ...
//  which is running within the UI's container. The service is supposed to ...
// ... work with this server. 

export class ContainerServerService {

    private readonly FILE_SAVE_ENDPOINT = "savefile";
    private readonly CONTAINER_SERVER_ADDRESS = "http://localhost:" + Constants.Configuration.CONTAINER_SERVER_PORT;

    private readonly REQUEST_BODY_FILENAME_PARAM = "fileName";
    private readonly REQUEST_BODY_FILE_CONTENT_PARAM = "fileContent";
    constructor(private http: HttpClient) {}

    public saveFile(fileName: string, fileContent: string): Observable<Object> { 
        let requestBody = new FormData(); 
        requestBody.append(this.REQUEST_BODY_FILENAME_PARAM, fileName);
        requestBody.append(this.REQUEST_BODY_FILE_CONTENT_PARAM, fileContent);
        let targetUrl = `${this.CONTAINER_SERVER_ADDRESS}/${this.FILE_SAVE_ENDPOINT}`;
        return this.http.post(targetUrl, requestBody, {headers: this.getHttpHeadersForFileSave()});
    }

    private getHttpHeadersForFileSave(): HttpHeaders {
        let httpHeadersForMongooseRun = new HttpHeaders();
        httpHeadersForMongooseRun.append('Content-Type', 'multipart/form-data');
        httpHeadersForMongooseRun.append('Accept', '*/*');
        return httpHeadersForMongooseRun;
      }
}