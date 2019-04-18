import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { Constants } from 'src/app/common/constants';
import { ControlApiService } from 'src/app/core/services/control-api/control-api.service';
import { Subscription } from 'rxjs';
import { MongooseSetUpService } from 'src/app/core/services/mongoose-set-up-service/mongoose-set-up.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-configuration-editing',
  templateUrl: './configuration-editing.component.html',
  styleUrls: ['./configuration-editing.component.css']
})

export class ConfigurationEditingComponent implements OnInit {

  readonly CONFIGURATION_FILENAME = Constants.FileNames.CUSTOM_CONFIGURATION_FILENAME;

  // JSON Editor properties
  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;
  @ViewChild("apply-button-content-wrppaer") applyNewValueBtn: ElementRef;
  public jsonEditorOptions: JsonEditorOptions;
  // @PARAM jsonEditorData is the data which was originally in JSON 

  public jsonEditorData: any = "";



  private monitoringApiSubscriptions: Subscription = new Subscription();


  constructor(private controlApiService: ControlApiService,
    private mongooseSetUpService: MongooseSetUpService) {
    this.fetchConfigurationFromMongoose();
    this.configureJsonEditor();
  }

  // MARK: - Lifecycle 

  ngOnInit() { }

  ngOnDestroy() {
    console.log("Destroying configuration component. Saved configuration: " + JSON.stringify(this.jsonEditorData));
    // NOTE: Saving up an ubcomfirmed configuration in order to let user edit it later if he'd like to. 
    this.monitoringApiSubscriptions.unsubscribe(); 
  }

  // NOTE: Private methods

  private fetchConfigurationFromMongoose() {
    let mongooseTargetAddress = `${Constants.Http.HTTP_PREFIX}${environment.mongooseIp}:${environment.mongoosePort}`;
    this.monitoringApiSubscriptions.add(this.controlApiService.getMongooseConfiguration(mongooseTargetAddress).subscribe(
      configuration => {
        // TODO: Add entred nodes into configuration 
        // this.mongooseSetUpService.setUnprocessedConfiguration(configuration);
        this.jsonEditorData = configuration;
        console.log(`Applying Mongoose configuration: ${JSON.stringify(configuration)}`);
      },
      error => {
        // TODO: Hadnel error correctly. Maybe retry fetching the configuration? 
        const misleadingMsg = Constants.Alerts.SERVER_DATA_NOT_AVALIABLE;
        alert(misleadingMsg);
      }
    ));

  }

  private configureJsonEditor() {
    this.jsonEditorOptions = new JsonEditorOptions()

    // NOTE: JSON Editor could be customized using the following fields: 
    // ... this.editorOptions.mode = 'code'; - it'd customize the displaying of actual JSON; ...
    // ... ... avaliable modes are: code', 'text', 'tree', 'view'
    // ... this.editorOptions.schema = schema; - it'd customize the displaying of JSON editor 
    this.jsonEditorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes

    // NOTE: You could also configure JSON Editor's nav bar tools using the view child's fields.
    // ... example:
    // ... this.jsonEditorOptions.statusBar = false;
    // ... this.jsonEditorOptions.navigationBar = false;
    // ... this.jsonEditorOptions.search = false;

  }

}
