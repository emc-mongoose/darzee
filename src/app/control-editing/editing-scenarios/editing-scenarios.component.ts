import { Component, OnInit, ViewChild } from '@angular/core';
import { IpAddressService } from 'src/app/ip-address.service';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';


@Component({
  selector: 'app-editing-scenarios',
  templateUrl: './editing-scenarios.component.html',
  styleUrls: ['./editing-scenarios.component.css']
})
export class EditingScenariosComponent implements OnInit {
  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;

  public editorOptions: JsonEditorOptions;
  public data: any;

  public fileContent: string | ArrayBuffer;

  constructor(private service: IpAddressService) { 
    this.fileContent = service.fileContent;
    this.configureJsonEditor();
  }


  ngOnInit() {
  }

  // NOTE: Private methods
  private configureJsonEditor() {
    this.editorOptions = new JsonEditorOptions()

    // NOTE: JSON Editor could be customized using the following fields: 
    // ... this.editorOptions.mode = 'code'; - it'd customize the displaying of actual JSON; ...
    // ... ... avaliable modes are: code', 'text', 'tree', 'view'
    // ... this.editorOptions.schema = schema; - it'd customize the displaying of JSON editor 
    this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.data = {
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
  
   
    this.editorOptions.statusBar = false;
    this.editorOptions.onChange = () =>  {
      console.log("Data has been changed:");
      console.log(this.editor.get()); 
    }
  }

}
