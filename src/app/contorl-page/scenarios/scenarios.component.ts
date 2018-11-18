import { Component, OnInit, ViewChild } from '@angular/core';
import { IpAddressService } from 'src/app/ip-address.service';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { Doc } from 'codemirror';



@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent implements OnInit {

  @ViewChild('scenarioCodeEditor') codeEditor: CodemirrorComponent;

  readonly scenarioEditorOptions = {
    lineNumbers: true,
    theme: 'default',
    mode: { name: 'javascript', typescript: true },
  };

  private fileContent: string | ArrayBuffer;
  private processingFile: File;

  constructor(private service: IpAddressService) { 
    this.fileContent = ""
    this.processingFile = null;
  }


  // MARK: - Component lifecycle

  ngOnInit() {
  }

  ngAfterViewInit() { 
    this.setValueForEditor("Select Javascript file..");
  }

  private setValueForEditor(newValue: string) { 
    const { doc } = this;
    if (doc) { 
      doc.setValue(newValue);
    }
  }

  private getValueFromEditor(): string | undefined { 
    const { doc } = this;
    if (!doc) { 
      return null;
    }
    return doc.getValue(); 
  }

  get doc() {
    // NOTE: The "core" of CodeMirror editor is Doc. 
    return (this.codeEditor.codeMirror as any) as Doc;
  }

  processFile(event) { 
    if (event.target.files.length == 0) {
      console.log("File hasn't been selected.");
      return
   }
   this.processingFile = event.target.files[0];
     let fileReader = new FileReader();
     fileReader.onload = () => {
      console.log(fileReader.result);
      this.fileContent = fileReader.result;
      this.setValueForEditor(this.fileContent.toString());
      this.service.fileContent = fileReader.result;
    };
    fileReader.readAsText(this.processingFile);
  }
  
  onStartBtnClicked() { 
    alert("Mangoose started.");
  }
  
  onSaveBtnClicked() {
    if ((this.processingFile != null) && (this.fileContent.toString() != "")) { 
      alert("File has been saved.");
    } else { 
      alert("Nothing to be saved.");
    }
  }  

  onScenarioEditorFocusChange() { 
    console.log("focus has changed");
  }
}
