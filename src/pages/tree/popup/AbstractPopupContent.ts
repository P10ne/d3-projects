import { Subject } from "rxjs";

export abstract class AbstractPopupContent {
  protected _onClose$ = new Subject<any>();
  onClose$ = this._onClose$.pipe();

  node!: HTMLElement;

  constructor(tmp: string, data?: any) {
    this.initNode(tmp);
    this.initData(data);
    this.initHandlers(data);
  }

  private initNode(tmp: string): void {
    const container: HTMLDivElement = document.createElement('div');
    container.innerHTML = tmp;
    this.node = container;
  }

  protected abstract initData(data?: any): void;
  protected abstract initHandlers(data?: any): void;
}
