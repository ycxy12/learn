// 英文
import { IsString, Matches, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称', example: '管理员' })
  @IsString()
  @Length(2, 50, { message: '角色名称长度必须在2到50个字符之间' })
  name: string;

  @ApiProperty({ description: '角色编码', example: 'admin' })
  @IsString()
  @Length(2, 50, { message: '角色编码长度必须在2到50个字符之间' })
  @Matches(/^[a-zA-Z_]+$/, { message: '角色编码只能包含英文字母和下划线' })
  code: string;

  @ApiProperty({ description: '角色描述', example: '管理员角色' })
  @IsString()
  @IsOptional()
  @Length(0, 200, { message: '角色描述长度不能超过200个字符' })
  description: string;
}
