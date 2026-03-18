import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Menu } from '../menu/entities/menu.entity';
export declare class RoleService {
    private readonly roleRepo;
    constructor(roleRepo: Repository<Role>);
    create(createRoleDto: CreateRoleDto): Promise<Role>;
    findAll(): Promise<Role[]>;
    findOne(id: number): Promise<Role>;
    update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role>;
    remove(id: number): Promise<Role>;
    getRoleMenus(id: number): Promise<Menu[]>;
    assignMenus(id: number, menuIds: number[]): Promise<Menu[]>;
}
