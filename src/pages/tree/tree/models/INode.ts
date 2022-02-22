export interface INode<T extends {} = any> {
  id: number;
  data: T;
  childrenIds: number[];
  parentIds: number[];
  depth: number;
}