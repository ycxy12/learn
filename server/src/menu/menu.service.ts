import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

export interface MenuTreeNode extends Menu {
  children?: MenuTreeNode[];
}

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepo: Repository<Menu>,
  ) {}

  /** 获取所有菜单（平铺） */
  async findAll(): Promise<Menu[]> {
    return this.menuRepo.find({ order: { sort: 'ASC', id: 'ASC' } });
  }

  /** 获取菜单树（嵌套结构） */
  async findTree(): Promise<MenuTreeNode[]> {
    const all = await this.findAll();
    return this.buildTree(all);
  }

  private buildTree(
    items: Menu[],
    parentId: number | null = null,
  ): MenuTreeNode[] {
    return items
      .filter((item) => (item.parentId ?? null) === parentId)
      .map((item) => ({
        ...item,
        children: this.buildTree(items, item.id),
      }));
  }

  async create(dto: CreateMenuDto): Promise<Menu> {
    const menu = this.menuRepo.create(dto);
    return this.menuRepo.save(menu);
  }

  async update(id: number, dto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.menuRepo.findOneBy({ id });
    if (!menu) throw new NotFoundException(`菜单 #${id} 不存在`);
    Object.assign(menu, dto);
    return this.menuRepo.save(menu);
  }

  async remove(id: number): Promise<void> {
    const menu = await this.menuRepo.findOneBy({ id });
    if (!menu) throw new NotFoundException(`菜单 #${id} 不存在`);
    await this.menuRepo.delete(id);
  }
}
