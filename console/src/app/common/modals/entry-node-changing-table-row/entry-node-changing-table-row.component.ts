import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { MongooseRunNode } from 'src/app/core/models/mongoose-run-node.model';

@Component({
  selector: 'app-entry-node-changing-table-row',
  templateUrl: './entry-node-changing-table-row.component.html',
  styleUrls: ['./entry-node-changing-table-row.component.css']
})
export class EntryNodeChangingTableRowComponent implements OnInit {

  @Input() testNode: MongooseRunNode;

  @ViewChild(`declinedEntryNodeBadge`) declinedEntryNodeBadge: TemplateRef<any>;
  @ViewChild(`halfTransparentBadge`) transparentEntryNodeBadge: TemplateRef<any>;
  @ViewChild('confirmedEntryNodeBadge') confirmedEntryNodeBadge: TemplateRef<any>;


  constructor() { }

  ngOnInit() {
    console.log(`Row on init.`);
    console.log(`testNode is: ${JSON.stringify(this.testNode)}`)
  }

  public onRowClicked(node: MongooseRunNode): void { 
    console.log(`User has clicked ${node.getResourceLocation()} row.`);
  }

  public isEntryNode(node: MongooseRunNode): boolean { 
    const entryNode: MongooseRunNode = node;
    return (entryNode.getResourceLocation() == node.getResourceLocation());
  }


  public getAdditionalBadges(node: MongooseRunNode): TemplateRef<any> { 
    if (this.isEntryNode(node)) { 
      return this.declinedEntryNodeBadge;
    } 
    return this.transparentEntryNodeBadge;
    
  }


    /**
   * Handles event when mouse is over @param node's row. 
   */
  public onMouseOverTableRow(node: MongooseRunNode): void { 
    console.log(`mouse has entered the row. Node: ${node.getResourceLocation()}`)
  }

}
