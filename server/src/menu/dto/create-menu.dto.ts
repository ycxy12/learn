import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ description: '菜单名称', example: 'Todo管理' })
  @IsString()
  @IsNotEmpty({ message: '菜单名称不能为空' })
  name: string;

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
}
