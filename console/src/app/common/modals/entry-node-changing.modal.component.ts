import { Component, Input, TemplateRef, ViewChild, Output, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MongooseRunNode } from 'src/app/core/models/mongoose-run-node.model';
import { MongooseSetUpService } from 'src/app/core/services/mongoose-set-up-service/mongoose-set-up.service';
import { Subscription, of } from 'rxjs';
import { MongooseConfigurationParser } from 'src/app/core/models/mongoose-configuration-parser';
import { map, catchError, tap } from 'rxjs/operators';
import { MongooseDataSharedServiceService } from 'src/app/core/services/mongoose-data-shared-service/mongoose-data-shared-service.service';
import { HttpUtils } from '../HttpUtils';
import { Router } from '@angular/router';
import { RoutesList } from 'src/app/modules/app-module/Routing/routes-list';

@Component({
  selector: 'entry-node-changing-modal',
  templateUrl: './entry-node-changing.modal.component.html'
})
export class EntryNodeChangingModalComponent implements OnDestroy {

  public readonly NODE_ADDRESS_ENTRANCE_AREA_PLACEHOLDER: string = "Enter new entry node address..";

  private readonly INACTIVE_NODE_TABLE_ROW_CSS_CLASS: string = "table-danger";
  private readonly DEFAULT_NODE_TABLE_ROW_CSS_CLASS: string = "";

  @Input() title: string;
  @Input() discription: string;

  @Input() nodes: MongooseRunNode[];

  @ViewChild('halfTransparentBadge') halfTransparentBadge: TemplateRef<any>;
  @ViewChild('inactiveNodeBadge') inactiveNodeBadge: TemplateRef<any>;
  @ViewChild('selectedEntryNodeBadge') selectedEntryNodeBadge: TemplateRef<any>;


  public typeaheadRecommendedNodesAddresses: string[] = [];
  public shouldDisplayPopoverOnEntryNodeTag: boolean = false;
  public typeaheadEnteredNodeAddress: string = "";
  private mongooseSetupNodesSubscription: Subscription = new Subscription();
  private isMongooseLaunchInProgress: boolean = false;

  /**
   * @param currentHoveringNodeLocation location of node which is currently being hovered. It's ...
   * ... used to display semi-transparent entry node tag.
   * @param updatedEntryNode user-selected entry node. The node is selected after user has clicked its row.
   * @param inactiveNodes collection of inactive nodes.
   */
  private currentHoveringNodeLocation: string = "";
  private updatedEntryNode: MongooseRunNode;
  private inactiveNodes: MongooseRunNode[] = [];

  // MARK: - Private 

  constructor(
    private router: Router,
    public currentModalView: NgbActiveModal,
    private mongooseSetUpService: MongooseSetUpService,
    private mongooseDataSharedService: MongooseDataSharedServiceService) {
    this.configureNodes();
    this.configureNodeAddressTypeahead();
  }

  ngOnDestroy(): void {
    this.mongooseSetupNodesSubscription.unsubscribe();
  }

  // MARK: - Public 

  public configureNodes(): void {
    const initialInactiveNode: MongooseRunNode = this.mongooseSetUpService.getMongooseEntryNode();
    if (initialInactiveNode != undefined) {
      this.inactiveNodes.push(initialInactiveNode);
    }
  }

  public configureNodeAddressTypeahead(): void {
    this.mongooseDataSharedService.getAvailableRunNodes().subscribe(
      (runNodes: MongooseRunNode[]) => {
        var udpatedListOfAddresses: string[] = [];
        runNodes.forEach(
          (node: MongooseRunNode) => {
            const nodeAddress: string = node.getResourceLocation();
            udpatedListOfAddresses.push(nodeAddress);
          }
        );
        this.typeaheadRecommendedNodesAddresses = udpatedListOfAddresses;
      }
    );
  }

  /**
   * Handles event when mouse is over @param node's row. 
   */
  public onMouseEnterTableRow(node: MongooseRunNode): void {
    this.currentHoveringNodeLocation = node.getResourceLocation();
  }

  public onMouseLeaveTableRow(node: MongooseRunNode): void {
    this.currentHoveringNodeLocation = "";
  }

  public onRowClicked(node: MongooseRunNode): void {
    if (this.isInactiveNode(node)) {
      this.shouldDisplayPopoverOnEntryNodeTag = true;
      return;
    }

    const nodeResourceLocation: string = node.getResourceLocation();
    this.mongooseSetUpService.isMongooseNodeActive(nodeResourceLocation).subscribe(
      (isActive: boolean) => { 
        console.log(`isActive? ${isActive}`)
        if (!isActive) { 
          console.error(`New entry node ${nodeResourceLocation} is not active.`);
          return; 
        }
        this.updatedEntryNode = node;
      }
    );
  }

  public isInactiveNode(node: MongooseRunNode): boolean {
    return (this.inactiveNodes.includes(node));
  }


  public getClassForTableRowRepresentingNode(node: MongooseRunNode): string {
    if (this.isInactiveNode(node)) {
      return this.INACTIVE_NODE_TABLE_ROW_CSS_CLASS;
    }
    return this.DEFAULT_NODE_TABLE_ROW_CSS_CLASS;
  }


  public onKeyPressedWhileEnteringNodeAddress(address: string): void {
    if (!HttpUtils.isIpAddressValid(address)) {
      return;
    }
    let newNode: MongooseRunNode = new MongooseRunNode(address);
    const matchingNode: MongooseRunNode = this.getMatchingNodeFromTable(newNode);
    const isNodeAlreadyAdded: boolean = (matchingNode != undefined);
    if (isNodeAlreadyAdded) {
      // NOTE: If Node's address is already in a table, ...
      // ... set it as selected.
      this.onRowClicked(matchingNode);
      return;
    }
    this.nodes.push(newNode);

    // NOTE: Reset entering address after it's validation.
    const emptyValue: string = "";
    this.typeaheadEnteredNodeAddress = emptyValue;

    // NOTE: Set node as selected right after addition. 
    this.onRowClicked(newNode);
  }

  public onRetryBtnClicked(): void {
    const entryNode: MongooseRunNode = this.updatedEntryNode;
    this.isMongooseLaunchInProgress = true;
    this.mongooseSetUpService.changeEntryNode(entryNode);
    this.mongooseSetupNodesSubscription = this.mongooseSetUpService.runMongoose(entryNode).pipe(
      map(
        (mongooseRunId: string) => {
          console.log(`Mongoose has successfully launched on updated entry node with run ID: ${mongooseRunId}`);
          return true; 
        }
      ),
      catchError((error: any) => {
        this.inactiveNodes.push(entryNode);
        console.log(`Unable to launch Mongoose with entry node ${entryNode.getResourceLocation()}. Reason: ${error}`);
        return of(false);
      }),
      tap(() => { 
        this.isMongooseLaunchInProgress = false;
      })
    ).subscribe(
      (hasSuccessfullyLaunched: boolean) => {
        // NOTE: Finish retrying Mongoose launch. Disable spinner.
        // this.isMongooseLaunchInProgress = false;
      }
    );
  }

  /**
   * Handles setup termination.
   */
  public onExitSetupBtnClicked(): void { 
    const closeClickEvent: string = "Close click";
    this.currentModalView.close(closeClickEvent);
    this.router.navigate([RoutesList.RUNS]);
  }

  /**
   * @returns template for additional info within @param node's row.
   */
  public getTemplateForRow(node: MongooseRunNode): TemplateRef<any> {
    const isHovering: boolean = (this.currentHoveringNodeLocation == node.getResourceLocation());
    if (this.isInactiveNode(node)) {
      return this.inactiveNodeBadge;
    }

    if (this.updatedEntryNode != undefined) {
      const isUpdatedTableRow: boolean = (this.updatedEntryNode.getResourceLocation() == node.getResourceLocation());
      if (isUpdatedTableRow) {
        return this.selectedEntryNodeBadge;
      }
    }

    if (isHovering) {
      return this.halfTransparentBadge;
    }
  }

  public closeEntryNodePopover(): void {
    this.shouldDisplayPopoverOnEntryNodeTag = false;
  }

  public shouldDisplayLaunchingSpinner(): boolean {
    return this.isMongooseLaunchInProgress;
  }

  /**
   * Purpose: find validated node within table. It was implimented since ...
   * ... you can't really check if node has been added into the table via .includes method because ...
   * ... additional badges are already applied.
   * @returns instance of Node from table.
   * @param node 
   */
  private getMatchingNodeFromTable(node: MongooseRunNode): MongooseRunNode | undefined {
    const matchingNodeIndex: number = this.nodes.findIndex(
      (currentNode: MongooseRunNode) => {
        const hasNodeAddressBeenAdded: boolean = node.getResourceLocation() == currentNode.getResourceLocation();
        return hasNodeAddressBeenAdded;
      }
    )
    return this.nodes[matchingNodeIndex]
  }
  
}
