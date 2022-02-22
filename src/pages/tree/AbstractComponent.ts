export abstract class AbstractComponent {
  private readonly _node: HTMLElement;

  get node(): HTMLElement {
    return this._node;
  }

  constructor(template: string) {
    this._node = this.initNode(template);
    this.initData();
    this.initHandlers();
  }

  private initNode(template: string): HTMLElement {
    const container: HTMLDivElement = document.createElement('div');
    container.innerHTML = template;
    return container.firstElementChild! as HTMLElement;
  }

  protected abstract initData(): void;
  protected abstract initHandlers(): void;
}