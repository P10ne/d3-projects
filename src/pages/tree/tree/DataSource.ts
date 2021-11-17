import { INode, TNewNode } from "./models";
import { AbstractDataSource } from "./AbstractDataSource";

export class DataSource<T extends INode> extends AbstractDataSource<T> {
  private LS_KEY = 'PERSONS_DATA';

  private async saveData(data: T[]): Promise<void> {
    try {
      localStorage.setItem(this.LS_KEY, JSON.stringify(data));
      return Promise.resolve();
    } catch (e) {
      return Promise.reject('Error while saving data');
    }
  }

  async getData(): Promise<T[]> {
    const data = localStorage.getItem(this.LS_KEY) || "[]";
    try {
      return Promise.resolve(JSON.parse(data!));
    } catch (e) {
      return Promise.reject('Error while reading data');
    }
  }

  async addNode<TToAddNode extends TNewNode>(node: TToAddNode): Promise<T> {
    const newDataWithId = {
      ...node,
      id: await this.generateNextId()
    };
    try {
      const data = await this.getData();
      data.push(newDataWithId as T);
      await this.saveData(data);
      return Promise.resolve(newDataWithId as T);
    } catch (e) {
      return Promise.reject('Error while adding data');
    }
  }

  async removeNode(node: T): Promise<boolean> {
    try {
      const data = await this.getData();
      const removingIndex = data.findIndex(item => item.id === node.id);
      if (removingIndex === -1) { return Promise.reject('Removing node was not found') }
      data.splice(removingIndex, 1);
      await this.saveData(data);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject('Error while removing data');
    }
  }

  async editNode(sourceNode: T, targetProps: Partial<T>): Promise<T> {
    try {
      const data = await this.getData();
      const updatingIndex = data.findIndex(item => item.id === sourceNode.id);
      if (updatingIndex === -1) { return Promise.reject('Updating obj was not found') }
      const newObj: T = { ...sourceNode, ...targetProps }
      data.splice(updatingIndex, 1, newObj);
      await this.saveData(data);
      return Promise.resolve(newObj);
    } catch (e) {
      return Promise.reject('Error while updating data');
    }
  }

  async getNodeById(id: number): Promise<T> {
    try {
      const data = await this.getData();
      const foundItem = data.find(item => item.id === id);
      return foundItem
        ? Promise.resolve(foundItem)
        : Promise.reject('Node was not found');
    } catch (e) {
      return Promise.reject('Error while getById');
    }
  }

  async getNodeChildren(node: T): Promise<T[]> {
    return Promise.resolve([]);
  }

  async getNodeParents(node: T): Promise<T[]> {
    const data = await this.getData();
    return Promise.resolve(data.filter(item => item.childrenIds.includes(node.id)));
  }

  private async generateNextId(): Promise<number> {
    const data = await this.getData();
    return  data.length > 0 ? Math.max(...data.map(i => i.id)) + 1 : 0;
  }

}