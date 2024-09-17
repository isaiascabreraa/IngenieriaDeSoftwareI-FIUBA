import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

export interface Task {
  id: number;
  title: string;
  start_date: string
  end_date: string;
  status: number;
  priority: number,
  worker_id: any,
  project_id: any
}

export interface ISidebarItem {
  href: string
  title: string
}

export interface IComboItem {
  id: number
  name: string
}

export class Data {
  private _data: any;

  constructor(item: any) {
    this._data = item;
  }

  set data(data: any) {
    this._data = data;
  }

  get data() {
    return this._data;
  }
}

export interface IComboBoxItems {
  combo_items: IComboItem[],
  data: Data,
  default_value: {} | undefined
  def_option: { id: number, name: string }
}

export interface IMenuItem {
  name: string,
  description: string,
  href: string,
  icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & { title?: string | undefined; titleId?: string | undefined; } & RefAttributes<SVGSVGElement>>
}

export interface ICalloutTab {
  name: string,
  href: string,
  icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & { title?: string | undefined; titleId?: string | undefined; } & RefAttributes<SVGSVGElement>>
}


export interface IFlyoutMenuItem {
  name: string,
  menu_items: IMenuItem[],
  callout_items: ICalloutTab[]
}
