import { D3Simulation } from "./D3Simulation";
import { ILink, INode, TNewNode } from "./models";
import { map } from "rxjs";
import { getLinks } from "./functions/getLinks";
import { popup } from "../popup/Popup";
import { AddPersonPopup, IAddPersonPopupData } from "../popup/popups/AddPerson/AddPersonPopup";
import { AbstractDataSource } from "./AbstractDataSource";

export class Tree<TDataItem extends INode> {
  private _d3Simulation: D3Simulation;

  constructor(
    _svg: SVGElement,
    private _dataSource: AbstractDataSource<TDataItem>
  ) {
    this._d3Simulation = new D3Simulation(_svg);
    this.init();
  }

  public async init(): Promise<void> {
    this.subscribeToDataSource();
    await this._dataSource.update();
  }

  private subscribeToDataSource() {
    this._dataSource.data$.pipe(
      map(data => ({
        nodes: data,
        links: getLinks(data)
      }))
    ).subscribe(({ nodes, links }) => {
      const clonedNodes = JSON.parse(JSON.stringify(nodes)) as TDataItem[];
      const clonedLinks = JSON.parse(JSON.stringify(links)) as ILink[];

      this._d3Simulation.update(clonedNodes, clonedLinks);
    });
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
          parents: this._d3Simulation.checkedNodes
        }
      }
    }).onClose$.subscribe(({ hasError, data }) => {
      if (!hasError) {
        // @ts-ignore
        this.addChildNode(data, this._d3Simulation.checkedNodes);
      }
    })
  }

  private async addNode<T extends TNewNode>(data: T): Promise<TDataItem> {
    const addedNode = await this._dataSource.addNode(data);
    this._d3Simulation.clearCheckedNodes();
    this._dataSource.update();

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
    this._dataSource.update();

    return addedChildNode;
  }

  public async removeNode() {
    const nodeToDelete = this._d3Simulation.checkedNodes[0];
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
      this._dataSource.update();
    }
  }
}
