export abstract class AbstractStorage<T> {
  abstract getData: () => Promise<T[]>;
  abstract add: (obj: T) => Promise<T>;
  abstract remove: (obj: T) => Promise<boolean>;
  abstract update: (sourceObj: T, targetProps: Partial<T>) => Promise<T>;
  abstract getById: (id: number) => Promise<T>;
  abstract getParents: (obj: T) => Promise<T[]>;
  abstract getChildren: (obj: T) => Promise<T[]>;
}
