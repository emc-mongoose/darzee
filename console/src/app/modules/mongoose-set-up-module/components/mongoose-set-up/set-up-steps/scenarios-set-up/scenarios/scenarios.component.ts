import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { Doc } from 'codemirror';
import { FileOperations } from 'src/app/common/FileOperations/FileOperations';
import { FileFormat } from 'src/app/common/FileOperations/FileFormat';
import { Constants } from 'src/app/common/constants';
import { MongooseSetUpService } from 'src/app/core/services/mongoose-set-up-service/mongoose-set-up.service';



@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent implements OnInit, OnDestroy {

  @ViewChild('scenarioCodeEditor') codeEditor: CodemirrorComponent;

  readonly scenarioEditorOptions = {
    lineNumbers: true,
    theme: 'default',
    mode: { name: 'javascript', typescript: true },
  };

  private fileContent: string | ArrayBuffer;
  private processingFile: File;

  readonly CODE_EDITOR_PLACEHOLDER = Constants.Placeholders.CODE_EDITOR_PLACEHOLDER;

  constructor(
    private mongooseSetUpService: MongooseSetUpService
  ) {
    this.fileContent = ""
    this.processingFile = null;
  }

  // MARK: - Component lifecycle

  ngOnInit() { }

  ngAfterViewInit() {
    this.setValueForEditor(this.CODE_EDITOR_PLACEHOLDER);
  }

  ngOnViewDestroyed() {
    this.setCurrentEditorValueAsScenario()
  }

  ngOnDestroy(): void { }

  // MARK: - Public 

  public onScenarioEditorFocusChange() {
    this.changeTextFieldPlaceholder();
    // NOTE: Saving Scenario as soon as the User stops writing it. 
    this.setCurrentEditorValueAsScenario();
  }

  get doc() {
    // NOTE: The "core" of CodeMirror editor is Doc. 
    return (this.codeEditor.codeMirror as any) as Doc;
  }

  public processFile(event) {
    if (event.target.files.length == 0) {
      console.error("File hasn't been selected.");
      return;
    }
    this.processingFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      console.log(`Read file content: ${fileReader.result}`);
      this.fileContent = fileReader.result;
      this.setValueForEditor(this.fileContent.toString());
      // this.mongooseSetUpService.setSenario(this.fileContent.toString());
    };
    fileReader.readAsText(this.processingFile);
  }

  public onSaveBtnClicked() {
    const { doc } = this;
    if (this.isSavingAvaliable()) {
      let fileSaver: FileOperations = new FileOperations();
      const filename = Constants.FileNames.SCENARIO_FILE_NAME;
      const fileFormat = FileFormat.JS;
      let savingData = this.getValueFromEditor();
      const codeLinesDelimiter: string = ";";
      fileSaver.saveFile(filename, fileFormat, savingData, codeLinesDelimiter);
      let misleadingMsg = Constants.Alerts.FILE_SAVED;
      alert(misleadingMsg);
    } else {
      let misleadingMsg = Constants.Alerts.FILE_NOT_EDITED;
      alert(misleadingMsg);
    }
  }

  public onStartBtnClicked() {
    let misleadingMsg = Constants.Alerts.MONGOOSE_HAS_STARTED;
    alert(misleadingMsg);
  }

  // MARK: - Private

  private isSavingAvaliable(): boolean {
    const { doc } = this;
    const textFromCodeEditor = this.getValueFromEditor().toString();
    return ((doc) && (textFromCodeEditor != "") && (textFromCodeEditor != this.CODE_EDITOR_PLACEHOLDER));
  }

  private changeTextFieldPlaceholder() {
    const { doc } = this;
    if (!doc) {
      console.error("Couldn't connect to code editor.");
      return;
    }
    const codeEditorText = doc.getValue();
    const emptyString = "";
    switch (codeEditorText) {
      case this.CODE_EDITOR_PLACEHOLDER: {
        doc.setValue(emptyString);
        break;
      }
      case emptyString: {
        doc.setValue(this.CODE_EDITOR_PLACEHOLDER);
        break;
      }
    }
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

  private setCurrentEditorValueAsScenario() {
    let mongooseRunScenario = this.getValueFromEditor().toString();;
    this.mongooseSetUpService.setSenario(mongooseRunScenario);
  }
}
