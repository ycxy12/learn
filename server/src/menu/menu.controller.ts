import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@ApiTags('菜单管理')
@ApiBearerAuth()
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /** 获取菜单平铺列表 */
  @Get()
  @ApiOperation({ summary: '获取所有菜单（平铺）' })
  findAll() {
    return this.menuService.findAll();
  }

  /** 获取菜单树 */
  @Get('tree')
  @ApiOperation({ summary: '获取菜单树结构' })
  findTree() {
    return this.menuService.findTree();
  }

  /** 新增菜单 */
  @Post()
  @ApiOperation({ summary: '新增菜单' })
  create(@Body() dto: CreateMenuDto) {
    return this.menuService.create(dto);
  }

  /** 更新菜单 */
  @Put(':id')
  @ApiOperation({ summary: '更新菜单' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMenuDto) {
    return this.menuService.update(id, dto);
  }

  /** 删除菜单 */
  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}
