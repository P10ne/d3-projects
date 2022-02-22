import { BehaviorSubject, Observable } from "rxjs";
import { AbstractStorage, INode } from "./models";

// todo приватные методы, выполняют только работу с бд, публичные в том числе будут вызывать update

export class DataSource<T extends INode> {
  private _data: T[] = [];

  private _data$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  public data$: Observable<T[]> = this._data$.pipe();

  constructor(private _storage: AbstractStorage<T>) {
    this._data$.next(this._data);
  }

  async update(): Promise<void> {
    this._data = await this._storage.getData();
    this.emitData();
  }

  async add(data: Omit<T, 'id'>): Promise<T> {
    const newDataWithId = {
      ...data,
      id: this.generateNextId()
    };
    // todo fix "as T"
    const addedObj = await this._storage.add(newDataWithId as T);
    this._data.push(addedObj);
    this.emitData();
    return addedObj;
  }

  async addChild(child: Omit<T, 'id'>, firstParent: T, secondParent: T) {
    child.parentIds = [firstParent, secondParent].map(parent => parent.id);
    const { id: childId } = await this.add(child);
    firstParent.childrenIds.push(childId);
    secondParent.childrenIds.push(childId);

    // todo ts-ignore
    // @ts-ignore
    await this.edit(firstParent, { childrenIds: firstParent.childrenIds });
    // @ts-ignore
    await this.edit(secondParent, { childrenIds: secondParent.childrenIds });
    return this.update();
  }

  async remove(data: T) {
    const deleteSuccess = await this._storage.remove(data);
    this._data.filter(item => item.childrenIds.includes(data.id)).forEach(item => {
      const childrenIdIndexForDelete = item.childrenIds.findIndex(id => id === data.id);
      const newChildrenIds = item.childrenIds.splice(childrenIdIndexForDelete, 1);
      // @ts-ignore
      this.edit(item, {
        childrenIds: newChildrenIds
      });
    })
    return this.update();
  }

  async edit(source: T, target: Partial<T>) {
    const updatedObj = await this._storage.update(source, target);
    return this.update();
  }

  private emitData(): void {
    this._data$.next(this._data);
  }

  private generateNextId(): number {
    return this._data.length > 0 ? Math.max(...this._data.map(i => i.id)) + 1 : 0;
  }
}
