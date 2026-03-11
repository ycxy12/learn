// 英文
import { IsString, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称', example: '管理员' })
  @IsString()
  name: string;

  @ApiProperty({ description: '角色编码', example: 'admin' })
  @IsString()
  @Matches(/^[a-zA-Z_]+$/, { message: '角色编码只能包含英文字母和下划线' })
  code: string;

  @ApiProperty({ description: '角色描述', example: '管理员角色' })
  @IsString()
  @IsOptional()
  description: string;
}
