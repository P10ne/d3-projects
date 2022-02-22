import { INode } from "./INode";

export type TNewNode<T> = Omit<INode<T>, "id">;