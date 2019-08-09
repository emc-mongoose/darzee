import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MongooseRunNode } from 'src/app/core/models/mongoose-run-node.model';
import { MongooseSetUpService } from 'src/app/core/services/mongoose-set-up-service/mongoose-set-up.service';
import { MongooseDataSharedServiceService } from 'src/app/core/services/mongoose-data-shared-service/mongoose-data-shared-service.service';
import { LocalStorageService } from 'src/app/core/services/local-storage-service/local-storage.service';
import { MongooseStoredRunNode } from 'src/app/core/services/local-storage-service/mongoose-stored-run-node.model';
import { Subscription } from 'rxjs';
import { ResourceLocatorType } from 'src/app/core/models/address-type';

@Component({
  selector: '[app-nodes-set-up-table-row]',
  templateUrl: './nodes-set-up-table-row.component.html',
  styleUrls: ['./nodes-set-up-table-row.component.scss']
})
export class NodesSetUpTableRowComponent implements OnInit {

  /**
   * Displaying Mongoose run node instance.
   */
  @Input() runNode: MongooseRunNode;

  /**
   * Emits an event on inactive run node selection.
   */
  @Output() hasSelectedInactiveNode: EventEmitter<MongooseRunNode> = new EventEmitter<MongooseRunNode>();

  private readonly ENTRY_NODE_CUSTOM_CLASS: string = "entry-node";

  private isNodeInValidationProcess: boolean = false; 
  private slaveNodesSubscription: Subscription = new Subscription();

  // MARK: - Lifecycle 
  constructor(private mongooseSetUpService: MongooseSetUpService,
    private mongooseDataSharedService: MongooseDataSharedServiceService,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {}

  // MARK: - Public

  /**
   * Handle selected node (validates its reachability, etc.).
   * @param selectedNode instance of selected Mongoose node.
   */
  public onRunNodeSelect(selectedNode: MongooseRunNode) {
    let isNodeLocatedByIp: boolean = (selectedNode.getResourceType() == ResourceLocatorType.IP);
    // NOTE: Add noode if check mark has been set, remove if unset    
    let hasNodeBeenSelected: boolean = this.mongooseSetUpService.isNodeExist(selectedNode);

    if (hasNodeBeenSelected) {
      // NOTE: Remove node it checkmark has been unset.
      this.mongooseSetUpService.removeNode(selectedNode);
    }

    if (!hasNodeBeenSelected && isNodeLocatedByIp) {
      let selectedNodeResourceLocationIp: string = selectedNode.getResourceLocation();
      this.slaveNodesSubscription.add(
        this.mongooseSetUpService.isMongooseNodeActive(selectedNodeResourceLocationIp).subscribe(
          (isNodeActive: boolean) => {
            if (!isNodeActive) {
              // NOTE: Handle run node inactivity.
              this.hasSelectedInactiveNode.emit(selectedNode);
              return;
            }
            this.mongooseSetUpService.addNode(selectedNode);
          }
        )
      )
    }
  }

  /**
   * Handle node removal. 
   * @param savedNode will be removed from nodes list.
   */
  public onRunNodeRemoveClicked(savedNode: MongooseRunNode) {
    const removedNodeAddress: string = savedNode.getResourceLocation();

    let hasNodeBeenSavedToLocalStorage: boolean = this.localStorageService.getStoredMongooseNodes().some((storedNode: MongooseStoredRunNode) => {
      const currentStoredNodeAddres: string = storedNode.address;
      return (removedNodeAddress == currentStoredNodeAddres);
    });

    if (!hasNodeBeenSavedToLocalStorage) {
      this.localStorageService.saveMongooseRunNode(removedNodeAddress);
    }

    this.mongooseDataSharedService.deleteMongooseRunNode(savedNode);
  }

  public getCustomClassForNode(node: MongooseRunNode): string {
    let mongooseEntryNode: MongooseRunNode = this.mongooseSetUpService.getMongooseEntryNode();
    const noCustomClassTag: string = "";
    if (mongooseEntryNode == undefined) {
      return noCustomClassTag;
    }
    const entryNodeAddress: string = mongooseEntryNode.getResourceLocation();
    if (entryNodeAddress == node.getResourceLocation()) {
      const entryNodeClass: string = this.ENTRY_NODE_CUSTOM_CLASS;
      return entryNodeClass;
    }
    return noCustomClassTag;
  }

  /**
   * Determines if loading spinner should be displayed during node's validation.
   */
  public shouldDisplayLoadingSpinner(): boolean { 
    return this.isNodeInValidationProcess;
  }

}
