import { Component, OnInit, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { IpAddressService } from 'src/app/ip-address.service';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { Button } from 'protractor';


@Component({
  selector: 'app-editing-scenarios',
  templateUrl: './editing-scenarios.component.html',
  styleUrls: ['./editing-scenarios.component.css']
})
export class EditingScenariosComponent implements OnInit {

  // JSON Editor properties
  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;
  @ViewChild("apply-button-content-wrppaer") applyNewValueBtn: ElementRef;
  public jsonEditorOptions: JsonEditorOptions;
  public jsonEditorData: any;
  // currentJsonEditorData is using to compare edited and current values of JSON 
  public currentJsonEditorData: any; 
  
  // Component properties 

  private hasJsonEdited: Boolean = false

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
    this.jsonEditorData = {
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

    this.currentJsonEditorData ={
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
    this.hasJsonEdited = !(editedJson === this.currentJsonEditorData);
    this.applyNewValueBtn.nativeElement.focus();
  }


  onApplyButtonClicked() { 
    alert("New value has been applied.");
    this.hasJsonEdited = false;
  }

  
}
