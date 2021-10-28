export abstract class AbstractStorage<T> {
  abstract getData: () => Promise<T[]>;
  abstract add: (obj: T) => Promise<T>;
  abstract remove: (obj: T) => Promise<boolean>;
  abstract update: (sourceObj: T, targetProps: Partial<T>) => Promise<T>;
}
