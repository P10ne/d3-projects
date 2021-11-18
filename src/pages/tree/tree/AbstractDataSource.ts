import { BehaviorSubject, Observable } from "rxjs";
import { INode, TNewNode } from "./models";

export abstract class AbstractDataSource<T extends INode> {
  abstract getData(): Promise<T[]>;
  abstract addNode<TToAddNode extends TNewNode>(node: TToAddNode): Promise<T>;
  abstract removeNode(node: T): Promise<boolean>;
  abstract editNode(sourceNode: T, targetProps: Partial<T>): Promise<T>;
  abstract getNodeById(id: number): Promise<T>;
  abstract getNodeParents(node: T): Promise<T[]>;
  abstract getNodeChildren(node: T): Promise<T[]>;
  abstract getTreeByNode(node: T): Promise<T[]>;
}