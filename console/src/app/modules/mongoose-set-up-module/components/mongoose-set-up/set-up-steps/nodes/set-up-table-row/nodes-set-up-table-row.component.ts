import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MongooseRunNode } from 'src/app/core/models/mongoose-run-node.model';
import { MongooseSetUpService } from 'src/app/core/services/mongoose-set-up-service/mongoose-set-up.service';
import { MongooseDataSharedServiceService } from 'src/app/core/services/mongoose-data-shared-service/mongoose-data-shared-service.service';
import { LocalStorageService } from 'src/app/core/services/local-storage-service/local-storage.service';
import { MongooseStoredRunNode } from 'src/app/core/services/local-storage-service/mongoose-stored-run-node.model';
import { Subscription, of } from 'rxjs';
import { ResourceLocatorType } from 'src/app/core/models/address-type';
import { map, catchError } from 'rxjs/operators';
import { CustomCheckBoxModel } from 'angular-custom-checkbox';


@Component({
  selector: '[app-nodes-set-up-table-row]',
  templateUrl: './nodes-set-up-table-row.component.html',
  styleUrls: ['./nodes-set-up-table-row.component.scss']
})
export class NodesSetUpTableRowComponent implements OnInit {

  /**
   * @param runNode describes displaying Mongoose run node instance.
   */

  @Input() runNode: MongooseRunNode;

  /**
   * @param hasSelectedInactiveNode emits an event on inactive run node selection.
   */

  @Output() hasSelectedInactiveNode: EventEmitter<MongooseRunNode> = new EventEmitter<MongooseRunNode>();

  private readonly ENTRY_NODE_CUSTOM_CLASS: string = "entry-node";
  
  private readonly CHECKBOX_SUCCESS_COLOR: string = "p-success";
  private readonly CHECKBOX_SUCCESS_ICON: string = 'fa fa-check';

  private readonly CHECKBOX_FAILURE_COLOR: string = "p-danger";
  private readonly CHECKBOX_FAILURE_ICON: string = 'fa fa-refresh';

  private isNodeInValidationProcess: boolean = false;
  private slaveNodesSubscription: Subscription = new Subscription();

  /**
   * @param isNodeSelected indicates whether a node has been selected AND validated. 
   * @param checkboxConfiguration describes an instance of custom checkbox for node selection.
   * @param additionalNodeInfoBadges contains additional strings that are displayed as badges.
   */
  public isNodeSelected: boolean = false;
  public checkboxConfiguration: CustomCheckBoxModel = new CustomCheckBoxModel();
  public additionalNodeInfoBadges: Set<string> = new Set();

  // MARK: - Lifecycle 
  constructor(private mongooseSetUpService: MongooseSetUpService,
    private mongooseDataSharedService: MongooseDataSharedServiceService,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.checkboxConfiguration.rounded = true;
  }

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
      this.isNodeInValidationProcess = true;
      this.slaveNodesSubscription.add(
        this.mongooseSetUpService.getMongooseRunNodeInstance(selectedNodeResourceLocationIp).pipe(
          map(
            (runNodeInstance: MongooseRunNode | undefined) => {
              const hasNodeSelectionSuccseed: boolean = (runNodeInstance != undefined);
              const displayingNode: MongooseRunNode = hasNodeSelectionSuccseed ? runNodeInstance : selectedNode;
              this.changeNodeSelectionCheckboxAppearence(displayingNode, hasNodeSelectionSuccseed);
              return runNodeInstance;
            }
          ),
          catchError((error: any) => {
            // NOTE: Handle run node inactivity.
            console.error(`Unable to select node. Details: ${error}`);
            return error;
          })
        ).
          subscribe(
            (runNodeInstance: (MongooseRunNode | undefined)) => {
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

  /**
   * Handles checkbox state changing after node's selection.
   * @param node selected run node.
   * @param nodeActivityState describes node's state (currently: active / non-active)
   */
  private changeNodeSelectionCheckboxAppearence(node: MongooseRunNode, nodeActivityState: boolean): void {
    // NOTE: Set checkbox to 'selected' state since we're changng the selected checkbox appearence.
    this.isNodeSelected = true;

    if (nodeActivityState) {
      this.checkboxConfiguration.color = this.CHECKBOX_SUCCESS_COLOR;
      this.checkboxConfiguration.icon = this.CHECKBOX_SUCCESS_ICON;

      const driverType: string = node.getDriverType();
      this.additionalNodeInfoBadges.add(driverType);

      const imageVersion: string = node.getImageVersion();
      this.additionalNodeInfoBadges.add(imageVersion);

      this.mongooseSetUpService.addNode(node);
    } else {
      this.checkboxConfiguration.color = this.CHECKBOX_FAILURE_COLOR;
      this.checkboxConfiguration.icon = this.CHECKBOX_FAILURE_ICON;
      this.hasSelectedInactiveNode.emit(node);
    }
  }

}
