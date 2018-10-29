import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  processFile(event) { 
    if (event.target.files.length == 0) {
      console.log("File hasn't been selected.");
      return
   }
     let file: File = event.target.files[0];
     console.log("Contet: ", file.name)

     let fileReader = new FileReader();
     fileReader.onload = () => {
      console.log(fileReader.result);
    };
    fileReader.readAsText(file);


     // after here 'file' can be accessed and used for further process
  }
  

}
