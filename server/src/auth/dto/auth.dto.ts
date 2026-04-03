/**
 * 📚 第四阶段 - Auth DTO
 */

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: '邮箱' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  @ApiProperty({ example: '123456', description: '密码' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 20, { message: '密码长度必须在6到20个字符之间' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: '邮箱' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  @ApiProperty({ example: '123456', description: '密码，6-20位' })
  @IsString()
  @Length(6, 20, { message: '密码长度必须在6到20个字符之间' })
  password: string;

  @ApiProperty({ example: '张三', description: '用户名' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(2, 50, { message: '用户名长度必须在2到50个字符之间' })
  name: string;

  @ApiPropertyOptional({ example: [1, 2], description: '关联的角色 ID 数组' })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true, message: '角色 ID 必须为数字' })
  roleIds?: number[];
}
