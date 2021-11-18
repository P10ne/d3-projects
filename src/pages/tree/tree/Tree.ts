import { D3Simulation, ESimulationEvents, NodesType } from "./D3Simulation";
import { INode, TNewNode } from "./models";
import { getLinks } from "./functions/getLinks";
import { popup } from "../popup/Popup";
import { AddPersonPopup, IAddPersonPopupData } from "../popup/popups/AddPerson/AddPersonPopup";
import { AbstractDataSource } from "./AbstractDataSource";

export class Tree<TDataItem extends INode> {
  private _d3Simulation: D3Simulation;
  private _simulationCheckedNodes: NodesType[] = [];
  private _currentData: TDataItem[] = [];

  constructor(
    _svg: SVGElement,
    private _dataSource: AbstractDataSource<TDataItem>
  ) {
    this._d3Simulation = new D3Simulation(_svg);
  }

  private setDataAndUpdate(data: TDataItem[]): void {
    this._currentData = data;
    this.updateTree(data);
  }

  public async init(): Promise<void> {
    this.subscribeToCheckedNodes();
    const data = await this._dataSource.getData();
    this.setDataAndUpdate(data);
  }

  private subscribeToCheckedNodes(): void {
    this._d3Simulation.subscribe(ESimulationEvents.CheckedNodesChanged, (nodes) => {
      this._simulationCheckedNodes = nodes;
    })
  }

  private updateTree(data: TDataItem[]): void {
    const d3Nodes = data;
    const d3Links = getLinks(data);
    this._d3Simulation.update(d3Nodes, d3Links);
  }

  public openPopupToAddNode() {
    popup.open<IAddPersonPopupData>(AddPersonPopup, {
      popupConfig: { title: 'Добавление ноды' },
      contentConfig: {
        data: {
          children: [],
          parents: []
        }
      }
    }).onClose$.subscribe(({ hasError, data }) => {
      if (!hasError) {
        this.addNode(data);
      }
    })
  }

  public openPopupToAddChildNode() {
    popup.open<IAddPersonPopupData>(AddPersonPopup, {
      popupConfig: { title: 'Добавление дочерней ноды' },
      contentConfig: {
        data: {
          children: [],
          parents: this._simulationCheckedNodes
        }
      }
    }).onClose$.subscribe(({ hasError, data }) => {
      if (!hasError) {
        // @ts-ignore
        this.addChildNode(data, this._simulationCheckedNodes);
      }
    })
  }

  private async addNode<T extends TNewNode>(data: T): Promise<TDataItem> {
    const addedNode = await this._dataSource.addNode(data);
    this._d3Simulation.clearCheckedNodes();
    this.setDataAndUpdate(await this._dataSource.getData());

    return addedNode;
  }

  private async addChildNode<T extends TNewNode>(child: T, parents: TDataItem[]): Promise<TDataItem> {
    const addedChildNode = await this._dataSource.addNode({
      ...child,
      parentIds: parents.map(parent => parent.id)
    });

    for (let parent of parents) {
      // @ts-ignore
      await this._dataSource.editNode(parent, { childrenIds: [...parent.childrenIds, addedChildNode.id] });
    }
    this._d3Simulation.clearCheckedNodes();
    this.setDataAndUpdate(await this._dataSource.getData());

    return addedChildNode;
  }

  public async removeNode() {
    const nodeToDelete = this._simulationCheckedNodes[0];
    // @ts-ignore
    const children = await this._dataSource.getNodeChildren(nodeToDelete);
    if (children && children.length > 0) {
      alert('Нельзя удалить ноду, содержащую другие дочерние ноды');
      return;
    }
    // @ts-ignore
    const deleteSuccess = await this._dataSource.removeNode(nodeToDelete);
    if (deleteSuccess) {
      // @ts-ignore
      const parents = await this._dataSource.getNodeParents(nodeToDelete);
      for (let parent of parents) {
        const newChildrenIds = parent.childrenIds.filter(id => id !== nodeToDelete.id);
        // @ts-ignore
        await this._dataSource.editNode(parent, { childrenIds: newChildrenIds });

      }
      this._d3Simulation.clearCheckedNodes();
      this.setDataAndUpdate(await this._dataSource.getData());
    }
  }

  public async simpleTree() {
    // @ts-ignore
    this.setDataAndUpdate(await this._dataSource.getTreeByNode(this._simulationCheckedNodes[0]));
  }

  public async loadChildrenForSelected() {
    const children = await this._dataSource.getNodeChildren(this._simulationCheckedNodes[0] as TDataItem);
    this.setDataAndUpdate([...this._currentData, ...children]);
  }
}
