import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Menu } from '../menu/entities/menu.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const existingRole = await this.roleRepo.findOneBy({
      code: createRoleDto.code,
    });
    if (existingRole) {
      throw new ConflictException(`角色编码 ${createRoleDto.code} 已被占用`);
    }

    const role = this.roleRepo.create(createRoleDto);
    return this.roleRepo.save(role);
  }

  async findAll() {
    return this.roleRepo.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) {
      throw new NotFoundException(`角色 #${id} 不存在`);
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);

    if (updateRoleDto.code && updateRoleDto.code !== role.code) {
      const existingRole = await this.roleRepo.findOneBy({
        code: updateRoleDto.code,
      });
      if (existingRole) {
        throw new ConflictException(`角色编码 ${updateRoleDto.code} 已被占用`);
      }
    }

    Object.assign(role, updateRoleDto);
    return this.roleRepo.save(role);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    return this.roleRepo.remove(role);
  }

  async getRoleMenus(id: number) {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['menus'],
    });
    if (!role) {
      throw new NotFoundException(`角色 #${id} 不存在`);
    }
    return role.menus;
  }

  async assignMenus(id: number, menuIds: number[]) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`角色 #${id} 不存在`);
    }
    // We only need the IDs to set the ManyToMany relationship
    role.menus = menuIds.map((menuId) => ({ id: menuId }) as unknown as Menu);
    await this.roleRepo.save(role);
    return this.getRoleMenus(id);
  }
}
