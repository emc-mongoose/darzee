import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

// NOTE: Prometheus configuration is being send via the Node.JS server ...
//  which is running within the UI's container. The service is supposed to ...
// ... work with this server. 

export class ContainerServerService {

    private readonly FILE_SAVE_ENDPOINT = "savefile";
    // TODO: Change port to .env variable. 
    private readonly CONTAINER_SERVER_ADDRESS = "http://localhost:8080";

    private readonly REQUEST_BODY_FILENAME_PARAM = "fileName";
    private readonly REQUEST_BODY_FILE_CONTENT_PARAM = "fileContent";
    constructor(private http: HttpClient) {}

    public saveFile(fileName: String, fileContent: String) { 
        let requestBody = new FormData(); 
        requestBody.append(this.REQUEST_BODY_FILENAME_PARAM, fileName);
        requestBody.append(this.REQUEST_BODY_FILE_CONTENT_PARAM, fileContent);
        return this.http.post(`${this.CONTAINER_SERVER_ADDRESS}/${this.FILE_SAVE_ENDPOINT}`, requestBody, {headers: this.getHttpHeadersForFileSave()})
    }

    private getHttpHeadersForFileSave(): HttpHeaders {
        let httpHeadersForMongooseRun = new HttpHeaders();
        httpHeadersForMongooseRun.append('Content-Type', 'multipart/form-data');
        httpHeadersForMongooseRun.append('Accept', '*/*');
        return httpHeadersForMongooseRun;
      }
}