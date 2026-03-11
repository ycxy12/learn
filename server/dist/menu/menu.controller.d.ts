import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    findAll(): Promise<import("./entities/menu.entity").Menu[]>;
    findTree(): Promise<import("./menu.service").MenuTreeNode[]>;
    create(dto: CreateMenuDto): Promise<import("./entities/menu.entity").Menu>;
    update(id: number, dto: UpdateMenuDto): Promise<import("./entities/menu.entity").Menu>;
    remove(id: number): Promise<void>;
}
