import { INode } from "./INode";

export type TNewNode<T = any> = Omit<INode<T>, "id">;