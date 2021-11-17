import { BehaviorSubject, Observable } from "rxjs";
import { INode, TNewNode } from "./models";

export abstract class AbstractDataSource<T extends INode> {
  private _data$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  public data$: Observable<T[]> = this._data$.pipe();

  async update(): Promise<void> {
    this.emitData(await this.getData());
  }

  private emitData(data: T[]): void {
    this._data$.next(data);
  }

  abstract getData(): Promise<T[]>;
  abstract addNode<TToAddNode extends TNewNode>(node: TToAddNode): Promise<T>;
  abstract removeNode(node: T): Promise<boolean>;
  abstract editNode(sourceNode: T, targetProps: Partial<T>): Promise<T>;
  abstract getNodeById(id: number): Promise<T>;
  abstract getNodeParents(node: T): Promise<T[]>;
  abstract getNodeChildren(node: T): Promise<T[]>;
  abstract getTreeByNode(node: T): Promise<T[]>;
}