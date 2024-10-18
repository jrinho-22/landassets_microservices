export interface IMenuItemsBase {
  label: string;
  permission: 'admin' | 'all' | 'client'
}

export interface IMenuItemWithChildren extends IMenuItemsBase {
  children: Omit<IMenuItems, 'permission'>[];
  path?: never;  // Disallow path when children are present
}

export interface IMenuItemWithPath extends IMenuItemsBase {
  path: string;
  children?: never; // Disallow children when path is present
}

export type IMenuItems = IMenuItemWithChildren | IMenuItemWithPath;