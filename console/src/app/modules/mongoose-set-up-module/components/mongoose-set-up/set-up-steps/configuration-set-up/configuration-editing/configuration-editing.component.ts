import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { Constants } from 'src/app/common/constants';
import { Subscription } from 'rxjs';
import { MongooseSetUpService } from 'src/app/core/services/mongoose-set-up-service/mongoose-set-up.service';
import { MongooseRunNode } from 'src/app/core/models/mongoose-run-node.model';


@Component({
  selector: 'app-configuration-editing',
  templateUrl: './configuration-editing.component.html',
  styleUrls: ['./configuration-editing.component.css']
})

export class ConfigurationEditingComponent implements OnInit, OnDestroy {

  readonly CONFIGURATION_FILENAME = Constants.FileNames.CUSTOM_CONFIGURATION_FILENAME;

  // JSON Editor properties
  @ViewChild("apply-button-content-wrppaer") applyNewValueBtn: ElementRef;
  public jsonEditorOptions: JsonEditorOptions;

  // NOTE: JSON editor configuration is actual (modified) configuration retrieved from the UI.
  private jsonEditorConfiguration: any = "";
  private monitoringApiSubscriptions: Subscription = new Subscription();

  // MARK: - Lifecycle 

  constructor(private mongooseSetUpService: MongooseSetUpService) {
    this.configureJsonEditor();
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.mongooseSetUpService.setConfiguration(this.jsonEditorConfiguration);
    // NOTE: Saving up an ubcomfirmed configuration in order to let user edit it later if he'd like to. 
    this.monitoringApiSubscriptions.unsubscribe();
  }


  // MARK: - Public 

  public updateJsonEditorConfiguration(updatedConfiguration) {
    this.jsonEditorConfiguration = updatedConfiguration;
  }

  // MARK: - Private 

  private configureJsonEditor() {
    let mongooseEntryNode: MongooseRunNode = this.mongooseSetUpService.getMongooseEntryNode();
    this.monitoringApiSubscriptions.add(
      this.mongooseSetUpService.getMongooseConfigurationForSetUp(mongooseEntryNode).subscribe(
        configuration => {
          this.jsonEditorConfiguration = configuration;
        },
        error => {
          alert(`Mongoose's configuration couldn't be loaded. Details: ${error}`);
        }
      )
    )
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
