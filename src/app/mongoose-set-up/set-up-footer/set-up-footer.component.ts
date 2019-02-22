import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-set-up-footer',
  templateUrl: './set-up-footer.component.html',
  styleUrls: ['./set-up-footer.component.css']
})
export class SetUpFooterComponent implements OnInit {

  @Input() isSetupCompleted: boolean;
  @Input() confirmButtonTitle: string; 

  @Output() confirmButtonClick = new EventEmitter<boolean>();
  @Output() runButtonClick = new EventEmitter<boolean>(); 

  constructor() { }

  ngOnInit() {  }

  // MARK: - Public 
  
  onConfirmButtonClicked() { 
    this.confirmButtonClick.emit(true);
  }

  onRunButtonClicked() { 
    this.runButtonClick.emit(true);
  }
}
