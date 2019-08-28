import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
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

  @ViewChild('halfTransparentBadge') halfTransparentBadge: TemplateRef<any>;
  @ViewChild('entryNodeBadge') entryNodeBadge: TemplateRef<any>;
  @ViewChild('selectedEntryNodeBadge') selectedEntryNodeBadge: TemplateRef<any>;

  public shouldDisplayPopoverOnEntryNodeTag: boolean = false; 

  private currentHoveringNodeLocation: string = "";
  private updatedEntryNode: MongooseRunNode;

  constructor(
    public activeModal: NgbActiveModal,
    private mongooseSetUpService: MongooseSetUpService) {
  }

  /**
   * Handles event when mouse is over @param node's row. 
   */
  public onMouseOverTableRow(node: MongooseRunNode): void { 
    this.currentHoveringNodeLocation = node.getResourceLocation();
    console.log(`mouse has entered the row. Node: ${node.getResourceLocation()}`)
  }

  public onMouseOutTableRow(node: MongooseRunNode): void { 
    this.currentHoveringNodeLocation = "";
  }

  public onRowClicked(node: MongooseRunNode): void { 
    if (this.isEntryNode(node)) { 
      this.shouldDisplayPopoverOnEntryNodeTag = true; 
      alert(`Inactive entry node.`);
      return; 
    }
    this.updatedEntryNode = node; 
  }

  public isEntryNode(node: MongooseRunNode): boolean { 
    const entryNode: MongooseRunNode = this.nodes[0];
    return (entryNode.getResourceLocation() == node.getResourceLocation());
  }

  public getClassForTableRowRepresentingNode(node: MongooseRunNode): string { 
    if (this.isEntryNode(node)) { 
      return "table-danger";
    }
    const defaultTableRowStyle: string = "";
    return defaultTableRowStyle;
  }


  public onRetryBtnClicked(): void { 
    console.log('Retry button has been clicked.');
  }

  public getTemplateForRow(node: MongooseRunNode): TemplateRef<any> { 
    if (this.updatedEntryNode != undefined) {
      console.log(`this.updatedEntryNode.getResourceLocation(): ${this.updatedEntryNode.getResourceLocation()}`)
      console.log(`Current resource location: ${node.getResourceLocation()}`)
      const isUpdatedTableRow: boolean = (this.updatedEntryNode.getResourceLocation() == node.getResourceLocation());
      if (isUpdatedTableRow) { 
        return this.selectedEntryNodeBadge;
      }
    }
    
    const isHovering: boolean = (this.currentHoveringNodeLocation == node.getResourceLocation());
    if (this.isEntryNode(node)) { 
      return this.entryNodeBadge;
    }
    if (isHovering) { 
      return this.halfTransparentBadge;
    }
  }

  public closeEntryNodePopover(): void {
    this.shouldDisplayPopoverOnEntryNodeTag = false;
  }
}
