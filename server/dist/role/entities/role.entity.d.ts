import { Menu } from '../../menu/entities/menu.entity';
export declare class Role {
    id: number;
    name: string;
    code: string;
    description: string;
    menus: Menu[];
}
