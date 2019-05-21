import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entry-node-selection',
  templateUrl: './entry-node-selection.component.html',
  styleUrls: ['./entry-node-selection.component.css']
})
export class EntryNodeSelectionComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
