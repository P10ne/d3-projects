import { AbstractStorage, INode } from "./models";

export class Storage<T extends INode> implements AbstractStorage<T> {
  private LS_KEY = 'PERSONS_DATA';

  private async saveData(data: T[]): Promise<void> {
    try {
      localStorage.setItem(this.LS_KEY, JSON.stringify(data));
      return Promise.resolve();
    } catch (e) {
      return Promise.reject('Error while saving data');
    }
  }

  getData(): Promise<T[]> {
    const data = localStorage.getItem(this.LS_KEY) || "[]";
    try {
      return Promise.resolve(JSON.parse(data!));
    } catch (e) {
      return Promise.reject('Error while reading data');
    }
  }

  async add(obj: T): Promise<T> {
    try {
      const data = await this.getData();
      data.push(obj);
      await this.saveData(data);
      return Promise.resolve(obj);
    } catch (e) {
      return Promise.reject('Error while adding data');
    }
  }

  async remove(obj: T): Promise<boolean> {
    try {
      const data = await this.getData();
      const removingIndex = data.findIndex(item => item.id === obj.id);
      if (removingIndex === -1) { return Promise.reject('Removing obj was not found') }
      data.splice(removingIndex, 1);
      await this.saveData(data);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject('Error while removing data');
    }
  }

  async update(sourceObj: T, targetProps: Partial<T>): Promise<T> {
    try {
      const data = await this.getData();
      const updatingIndex = data.findIndex(item => item.id === sourceObj.id);
      if (updatingIndex === -1) { return Promise.reject('Updating obj was not found') }
      const newObj: T = { ...sourceObj, ...targetProps }
      data.splice(updatingIndex, 1, newObj);
      await this.saveData(data);
      return Promise.resolve(newObj);
    } catch (e) {
      return Promise.reject('Error while updating data');
    }
  }

  async getById(id: number): Promise<T> {
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

  async getChildren(obj: T): Promise<T[]> {
    return Promise.resolve([]);
  }

  async getParents(obj: T): Promise<T[]> {
    const data = await this.getData();
    return Promise.resolve(data.filter(item => item.childrenIds.includes(obj.id)));
  }

}