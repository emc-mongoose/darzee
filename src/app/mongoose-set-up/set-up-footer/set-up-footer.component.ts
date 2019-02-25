import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { bounceAnimation } from 'src/app/core/animations';

@Component({
  selector: 'app-set-up-footer',
  templateUrl: './set-up-footer.component.html',
  styleUrls: ['./set-up-footer.component.css'],
  animations: [
    bounceAnimation
  ]
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
