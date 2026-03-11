/**
 * 📚 第四阶段 - 主模块配置 (含 Auth)
 *
 * 💡 知识点：
 * - TypeOrmModule.forRoot() 配置数据库
 * - 导入 AuthModule 和 UserModule
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';
import { Todo } from './todo/entities/todo.entity';
import { User } from './user/entities/user.entity';
import { Menu } from './menu/entities/menu.entity';
import { Role } from './role/entities/role.entity';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    // 数据库配置
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.db',
      entities: [Todo, User, Menu, Role],
      synchronize: true,
      logging: ['error'],
    }),
    // 功能模块
    TodoModule,
    AuthModule,
    UserModule,
    MenuModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
