type TPublisherEvents = {
  [key: string]: (...args: any[]) => void
}

export class Publisher<TEvents extends TPublisherEvents> {
  private _subscribers: { [eventName: string]: ((...args: any[]) => void)[] } = {};

  protected publish<K extends keyof TEvents>(eventName: K, ...args: Parameters<TEvents[K]>): void {
    const listeners = this._subscribers[eventName as string];
    if (!listeners || listeners.length === 0) return;
    listeners.forEach(listener => listener(...args));
  }

  public subscribe<K extends keyof TEvents>(eventName: K, listener: TEvents[K]): void {
    const eventKey = eventName as string;
    if (!this._subscribers[eventKey]) {
      this._subscribers[eventKey] = [];
    }
    this._subscribers[eventKey].push(listener);
  }

  public unsubscribe<K extends keyof TEvents>(eventName: K, listener: TEvents[K]): void {
    const listeners = this._subscribers[eventName as string];
    const listenerToRemoveIndex = listeners.findIndex(l => l === listener);
    if (listenerToRemoveIndex !== -1) {
      listeners.splice(listenerToRemoveIndex, 1);
    }
  }
}