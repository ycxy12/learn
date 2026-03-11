import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
export interface MenuTreeNode extends Menu {
    children?: MenuTreeNode[];
}
export declare class MenuService {
    private menuRepo;
    constructor(menuRepo: Repository<Menu>);
    findAll(): Promise<Menu[]>;
    findTree(): Promise<MenuTreeNode[]>;
    private buildTree;
    create(dto: CreateMenuDto): Promise<Menu>;
    update(id: number, dto: UpdateMenuDto): Promise<Menu>;
    remove(id: number): Promise<void>;
}
