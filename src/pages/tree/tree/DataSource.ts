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

  async remove(data: T): Promise<boolean> {
    return await this._storage.remove(data);
  }

  async edit(source: T, target: Partial<T>): Promise<T> {
    return await this._storage.update(source, target);
  }

  async getById(id: number): Promise<T> {
    return await this._storage.getById(id);
  }

  async getParents(child: T): Promise<T[]> {
    return await this._storage.getParents(child);
  }

  async getChildren(parent: T): Promise<T[]> {
    return await this._storage.getChildren(parent);
  }



  private emitData(data: T[]): void {
    this._data$.next(data);
  }

  private async generateNextId(): Promise<number> {
    const data = await this._storage.getData();
    return  data.length > 0 ? Math.max(...data.map(i => i.id)) + 1 : 0;
  }
}
