import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() { }

  // Set a value in local storage
  setItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(key, value);
  }

  // Get a value from local storage
  static getItem(key: string): string | null {

    if (typeof localStorage !== 'undefined')
      return localStorage.getItem(key);
    return null;
  }

  public getItem1(key: string): string | null {
    if (typeof localStorage !== 'undefined')
      return localStorage.getItem(key);
    return null;
  }

  // Remove a value from local storage
  public static removeItem(key: string): void {
    if (typeof localStorage !== 'undefined')
      localStorage.removeItem(key);
  }

  // Clear all items from local storage
  public clear(): void {
    if (typeof localStorage !== 'undefined')
      localStorage.clear();
  }
}