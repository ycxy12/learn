import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  Length,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MenuType {
  DIR = 'DIR',
  MENU = 'MENU',
  BUTTON = 'BUTTON',
}

export class CreateMenuDto {
  @ApiProperty({ description: '菜单名称', example: 'Todo管理' })
  @IsString()
  @IsNotEmpty({ message: '菜单名称不能为空' })
  @Length(2, 50, { message: '菜单名称长度必须在2到50个字符之间' })
  name: string;

  @ApiPropertyOptional({
    description: '菜单类型',
    enum: MenuType,
    example: MenuType.MENU,
  })
  @IsOptional()
  @IsEnum(MenuType, { message: '菜单类型必须是 DIR, MENU 或 BUTTON' })
  type?: MenuType;

  @ApiPropertyOptional({ description: '路由路径', example: '/todos' })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiPropertyOptional({
    description: '前端组件路径',
    example: 'System/Menu/index',
  })
  @IsString()
  @IsOptional()
  component?: string;

  @ApiPropertyOptional({
    description: '图标名称',
    example: 'CheckSquareOutlined',
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ description: '排序', example: 1 })
  @IsNumber()
  @IsOptional()
  sort?: number;

  @ApiPropertyOptional({ description: '父菜单ID', example: null })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiPropertyOptional({ description: '是否显示', example: true })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @ApiPropertyOptional({
    description: '权限标识，如按钮级别的 user:create',
    example: 'user:create',
  })
  @IsString()
  @IsOptional()
  perms?: string;
}
