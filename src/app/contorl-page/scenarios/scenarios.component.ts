import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent implements OnInit {

  private fileContent: string | ArrayBuffer;
  private processingFile: File;
  constructor() { 
    this.fileContent = ""
    this.processingFile = null;
  }

  ngOnInit() {
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

}
