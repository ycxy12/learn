export declare enum MenuType {
    DIR = "DIR",
    MENU = "MENU",
    BUTTON = "BUTTON"
}
export declare class CreateMenuDto {
    name: string;
    type?: MenuType;
    path?: string;
    component?: string;
    icon?: string;
    sort?: number;
    parentId?: number;
    isVisible?: boolean;
    perms?: string;
}
