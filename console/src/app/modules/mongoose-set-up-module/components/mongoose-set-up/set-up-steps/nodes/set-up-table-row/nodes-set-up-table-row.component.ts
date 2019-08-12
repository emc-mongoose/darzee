import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MongooseRunNode } from 'src/app/core/models/mongoose-run-node.model';
import { MongooseSetUpService } from 'src/app/core/services/mongoose-set-up-service/mongoose-set-up.service';
import { MongooseDataSharedServiceService } from 'src/app/core/services/mongoose-data-shared-service/mongoose-data-shared-service.service';
import { LocalStorageService } from 'src/app/core/services/local-storage-service/local-storage.service';
import { MongooseStoredRunNode } from 'src/app/core/services/local-storage-service/mongoose-stored-run-node.model';
import { Subscription } from 'rxjs';
import { ResourceLocatorType } from 'src/app/core/models/address-type';
import { map } from 'rxjs/operators';
import { CustomCheckBoxModel } from 'angular-custom-checkbox';


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

  // @ViewChild(`checkboxInput`) checkboxInput;
  // @ViewChild(`checkboxLabel`) checkboxLabel;


  private readonly ENTRY_NODE_CUSTOM_CLASS: string = "entry-node";

  private isNodeInValidationProcess: boolean = false;
  private slaveNodesSubscription: Subscription = new Subscription();

  isSelected: boolean = false;
  configurationCustom: CustomCheckBoxModel = new CustomCheckBoxModel();

  // MARK: - Lifecycle 
  constructor(private mongooseSetUpService: MongooseSetUpService,
    private mongooseDataSharedService: MongooseDataSharedServiceService,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.configurationCustom.color = 'p-success';
    this.configurationCustom.colorHex = '#F500FF';
    this.configurationCustom.colorInside = '#FFF' //or 'white';
    this.configurationCustom.rounded = true;
    this.configurationCustom.icon = 'mdi mdi-check';
  }

  // MARK: - Public

  /**
   * Handle selected node (validates its reachability, etc.).
   * @param selectedNode instance of selected Mongoose node.
   */
  public onRunNodeSelect(selectedNode: MongooseRunNode) {
    // console.log(`Checkbox input value: ${this.checkboxInput.nativeElement.value}, whole JSON is: ${JSON.stringify(this.checkboxInput.nativeElement)}`);
    // console.log(`Checkbox label value: ${this.checkboxLabel.nativeElement.value}`);

    let isNodeLocatedByIp: boolean = (selectedNode.getResourceType() == ResourceLocatorType.IP);
    // NOTE: Add noode if check mark has been set, remove if unset    
    let hasNodeBeenSelected: boolean = this.mongooseSetUpService.isNodeExist(selectedNode);

    if (hasNodeBeenSelected) {
      // NOTE: Remove node it checkmark has been unset.
      this.mongooseSetUpService.removeNode(selectedNode);
    }

    if (!hasNodeBeenSelected && isNodeLocatedByIp) {
      let selectedNodeResourceLocationIp: string = selectedNode.getResourceLocation();
      this.isNodeInValidationProcess = true;
      this.slaveNodesSubscription.add(
        this.mongooseSetUpService.isMongooseNodeActive(selectedNodeResourceLocationIp).pipe(
          map(
            // NOTE: Node's validation process.
            (isNodeActive: boolean) => {
              this.isSelected = isNodeActive;

              if (!isNodeActive) {
                // NOTE: Handle run node inactivity.
                this.hasSelectedInactiveNode.emit(selectedNode);
                return;
              }
              this.mongooseSetUpService.addNode(selectedNode);
            },
          )
        ).subscribe(
          () => {
            // NOTE: End of validation process for node.
            this.isNodeInValidationProcess = false;
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
