import { D3Simulation } from "./D3Simulation";
import { DataSource } from "./DataSource";
import { ILink, INode, IPerson, TNewNode, TNewPerson } from "./models";
import { Storage } from "./Storage";
import { map } from "rxjs";
import { getLinks } from "./functions/getLinks";
import { popup } from "../popup/Popup";
import { AddPersonPopup, IAddPersonPopupData } from "../popup/popups/AddPerson/AddPersonPopup";

export class Tree<TDataItem extends INode> {
  private _d3Simulation: D3Simulation;
  private _dataSource: DataSource<TDataItem>;

  constructor(_svg: SVGElement) {
    this._d3Simulation = new D3Simulation(_svg);
    this._dataSource = new DataSource<TDataItem>(new Storage<TDataItem>());
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
    const addedNode = await this._dataSource.add(data);
    this._d3Simulation.clearCheckedNodes();
    this._dataSource.update();
    return addedNode;
  }

  private async addChildNode<T extends TNewNode>(child: T, parents: TDataItem[]): Promise<TDataItem> {
    const addedChildNode = await this._dataSource.add({
      ...child,
      parentIds: parents.map(parent => parent.id)
    });

    for (let parent of parents) {
      // @ts-ignore
      await this._dataSource.edit(parent, { childrenIds: [...parent.childrenIds, addedChildNode.id] });
    }
    this._d3Simulation.clearCheckedNodes();
    this._dataSource.update();

    return addedChildNode;
  }

  public async removeNode() {
    const nodeToDelete = this._d3Simulation.checkedNodes[0];
    // @ts-ignore
    const children = await this._dataSource.getChildren(nodeToDelete);
    if (children && children.length > 0) {
      alert('Нельзя удалить ноду, содержащую другие дочерние ноды');
      return;
    }
    // @ts-ignore
    const deleteSuccess = await this._dataSource.remove(nodeToDelete);
    if (deleteSuccess) {
      // @ts-ignore
      const parents = await this._dataSource.getParents(nodeToDelete);
      for (let parent of parents) {
        const newChildrenIds = parent.childrenIds.filter(id => id !== nodeToDelete.id);
        // @ts-ignore
        await this._dataSource.edit(parent, { childrenIds: newChildrenIds });

      }
      this._d3Simulation.clearCheckedNodes();
      this._dataSource.update();
    }
  }
}
