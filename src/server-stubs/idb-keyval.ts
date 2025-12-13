export async function get<T = any>(_key: any): Promise<T | undefined> {
  return undefined;
}

export async function set(_key: any, _value: any): Promise<void> {
  return;
}

export async function del(_key: any): Promise<void> {
  return;
}

export async function clear(): Promise<void> {
  return;
}

export async function keys<_KeyType>(): Promise<_KeyType[]> {
  return [];
}

export function createStore(_dbName: string, _storeName: string) {
  return async function useStore<T>(
    _txMode: any,
    callback: (store: any) => T | PromiseLike<T>
  ): Promise<T> {
    const result = await callback({});
    return result;
  };
}

