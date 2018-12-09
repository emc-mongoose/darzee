import { Component, OnInit, ViewChild } from '@angular/core';
import { IpAddressService } from 'src/app/ip-address.service';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';


@Component({
  selector: 'app-editing-scenarios',
  templateUrl: './editing-scenarios.component.html',
  styleUrls: ['./editing-scenarios.component.css']
})
export class EditingScenariosComponent implements OnInit {

  // JSON Editor properties
  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;
  public jsonEditorOptions: JsonEditorOptions;
  public jsonConfiguration: any;

  public fileContent: string | ArrayBuffer;

  constructor(private service: IpAddressService) { 
    this.fileContent = service.fileContent;
    this.configureJsonEditor();
  }


  ngOnInit() {
  }

  // NOTE: Private methods
  private configureJsonEditor() {
    this.jsonEditorOptions = new JsonEditorOptions()

    // NOTE: JSON Editor could be customized using the following fields: 
    // ... this.editorOptions.mode = 'code'; - it'd customize the displaying of actual JSON; ...
    // ... ... avaliable modes are: code', 'text', 'tree', 'view'
    // ... this.editorOptions.schema = schema; - it'd customize the displaying of JSON editor 
    this.jsonEditorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.jsonConfiguration = {
      products: [{
        name: 'car',
        product: [{
          name: 'honda',
          model: [
            { id: 'civic', name: 'civic' },
            { id: 'accord', name: 'accord' },
            { id: 'crv', name: 'crv' },
            { id: 'pilot', name: 'pilot' },
            { id: 'odyssey', name: 'odyssey' }
          ]
        }]
      }]
    };
  
   
    // NOTE: You could also configure JSON Editor's nav bar tools using the view child's fields.
    // ... example:
    // ... this.jsonEditorOptions.statusBar = false;
    // ... this.jsonEditorOptions.navigationBar = false;
    // ... this.jsonEditorOptions.search = false;

  }

  // NOTE: Callback which is observing whether the JSON value has been updated from editor
  private onJsonUpdated(editedJson) { 
    console.log("JSON has been edited:")
    console.log(editedJson)
  }

  onApplyButtonClicked() { 
    alert("New value has been applied.");
  }


}
