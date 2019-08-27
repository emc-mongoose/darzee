import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MongooseRunNode } from 'src/app/core/models/mongoose-run-node.model';

@Component({
  selector: 'ngbd-modal-content',
  templateUrl: './basic-modal.template.html'
})
export class BasicModalComponent {
  @Input() title: string;
  @Input() discription: string;

  @Input() nodes: MongooseRunNode[];
  
  constructor(public activeModal: NgbActiveModal) {}
}
