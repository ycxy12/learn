/**
 * 📚 主模块配置
 *
 * 💡 知识点：
 * - ConfigModule 全局加载 .env 环境变量
 * - TypeOrmModule.forRootAsync() 异步从环境变量读取 MySQL 配置
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    // 全局加载 .env 环境变量
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MySQL 数据库配置（从环境变量读取）
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', '127.0.0.1'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USER', 'root'),
        password: config.get<string>('DB_PASS', ''),
        database: config.get<string>('DB_NAME', 'learn1_db'),
        entities: [Todo, User, Menu, Role],
        synchronize: true, // 自动同步表结构（生产环境建议关闭，改用 migration）
        logging: ['error'],
        charset: 'utf8mb4',
      }),
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
