import {
  LocalStorageTyped,
  LocalStorageReturn,
  useLocalStorage
} from "./localStorage";
import { RefTyped } from "@vue-composable/core";
import { useSessionStorage } from "./sessionStorage";
import { useWebStorage } from "./webStorage";

let canUseLocalStorage: boolean | undefined = undefined;

export function useStorage(
  key: string,
  defaultValue?: RefTyped<string>,
  sync?: boolean
): LocalStorageReturn<string>;
export function useStorage<T extends object = any>(
  key: LocalStorageTyped<T> | string,
  defaultValue?: RefTyped<T>,
  sync?: boolean
): LocalStorageReturn<T>;
export function useStorage(key: string, defaultValue?: any, sync?: boolean) {
  if (canUseLocalStorage === undefined) {
    canUseLocalStorage = useWebStorage("localStorage").supported;
  }
  return canUseLocalStorage
    ? useLocalStorage(key, defaultValue, sync)
    : useSessionStorage(key, defaultValue, sync);
}
