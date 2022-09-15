import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  icon: string;
  role: string;
}

const MENUITEMS = [
  { state: 'dashboard', name: 'Dashboard', icon: 'dashboard', role: '' },
  { state: 'transaction', name: 'Manage Transactions', icon: 'grass', role: '' },
  { state: 'bill', name: 'View Bills', icon: 'money', role: '' },
  { state: 'my-transaction', name: 'My Transaction', icon: 'list_alt', role: '' },
  { state: 'user', name: 'Manage Users', icon: 'people', role: '' },
];

@Injectable()
export class MenuItems {
  getMenuItems(): Menu[] {
    return MENUITEMS;
  }
}
