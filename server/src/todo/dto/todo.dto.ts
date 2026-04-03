/**
 * 📚 NestJS 进阶 - 创建 Todo DTO
 *
 * DTO 用于验证请求数据，使用 class-validator 装饰器
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  Length,
} from 'class-validator';

export class CreateTodoDto {
  @IsString({ message: '标题必须是字符串' })
  @IsNotEmpty({ message: '标题不能为空' })
  @Length(1, 100, { message: '标题长度必须在1到100个字符之间' })
  title: string;

  @IsString()
  @IsOptional()
  @Length(0, 500, { message: '描述不能超过500个字符' })
  description?: string;
}

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @Length(1, 100, { message: '标题长度必须在1到100个字符之间' })
  title?: string;

  @IsString()
  @IsOptional()
  @Length(0, 500, { message: '描述不能超过500个字符' })
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
