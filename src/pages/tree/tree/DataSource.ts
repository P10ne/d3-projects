import { BehaviorSubject, Observable } from "rxjs";
import { AbstractStorage, INode, TNewNode } from "./models";

export class DataSource<T extends INode> {
  private _data$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  public data$: Observable<T[]> = this._data$.pipe();

  constructor(private _storage: AbstractStorage<T>) {}

  async update(): Promise<void> {
    this.emitData(await this._storage.getData());
  }

  async add(data: TNewNode): Promise<T> {
    const newDataWithId = {
      ...data,
      id: await this.generateNextId()
    };
    // todo fix "as T"
    return await this._storage.add(newDataWithId as T);
  }

  // async remove(data: T) {
  //   const deleteSuccess = await this._storage.remove(data);
  //   this._data.filter(item => item.childrenIds.includes(data.id)).forEach(item => {
  //     const childrenIdIndexForDelete = item.childrenIds.findIndex(id => id === data.id);
  //     const newChildrenIds = item.childrenIds.splice(childrenIdIndexForDelete, 1);
  //     // @ts-ignore
  //     this.edit(item, {
  //       childrenIds: newChildrenIds
  //     });
  //   })
  // }

  async edit(source: T, target: Partial<T>): Promise<T> {
    return await this._storage.update(source, target);
  }

  private emitData(data: T[]): void {
    this._data$.next(data);
  }

  private async generateNextId(): Promise<number> {
    const data = await this._storage.getData();
    return  data.length > 0 ? Math.max(...data.map(i => i.id)) + 1 : 0;
  }
}
