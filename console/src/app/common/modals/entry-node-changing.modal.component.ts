import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MongooseRunNode } from 'src/app/core/models/mongoose-run-node.model';
import { MongooseSetUpService } from 'src/app/core/services/mongoose-set-up-service/mongoose-set-up.service';

@Component({
  selector: 'entry-node-changing-modal',
  templateUrl: './entry-node-changing.modal.component.html'
})
export class EntryNodeChangingModalComponent {
  @Input() title: string;
  @Input() discription: string;

  @Input() nodes: MongooseRunNode[];

  constructor(
    public activeModal: NgbActiveModal,
    private mongooseSetUpService: MongooseSetUpService) {
  }
}
