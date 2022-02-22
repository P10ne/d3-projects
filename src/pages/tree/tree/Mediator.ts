import { Publisher } from "./Publisher";
import { NodesType } from "./D3Simulation";

export enum EMediatorEvents {
  RenderFullTreeForNode = 'RenderFullTreeForNode'
}

type TEvents = {
  [EMediatorEvents.RenderFullTreeForNode]: (node: NodesType) => void
}

class Mediator extends Publisher<TEvents> {
  public notify<K extends keyof TEvents>(eventName: K, ...args: Parameters<TEvents[K]>) {
    super.publish(eventName, ...args);
  }
}

export default new Mediator();