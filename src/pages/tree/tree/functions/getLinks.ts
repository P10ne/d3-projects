import { INode, ILink } from "../models";

export function getLinks(data: INode[]): ILink[] {
  const result: ILink[] = [];
  data.forEach((item, i) => {
    if (item.childrenIds.length > 0) {
      const linesFromCurrentItem = item.childrenIds.reduce<ILink[]>((prev, curr, index, arr) => {
        const currentChildrenIndex = data.findIndex(d => d.id === curr);
        return currentChildrenIndex !== -1
          ? [
              ...prev,
              {
                source: i,
                target: currentChildrenIndex
              }
            ]
          : prev
      }, []);
      if (linesFromCurrentItem.length > 0) {
        result.push(...linesFromCurrentItem);
      }
    }
  });
  return result;
}