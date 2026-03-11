/**
 * 📚 NestJS 进阶 - Todo Module
 *
 * Module 将 Controller、Service 和 Entity 组织在一起
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo]), // 注册 Todo 实体
  ],
  controllers: [TodoController],
  providers: [TodoService],
  exports: [TodoService], // 导出 Service 供其他模块使用
})
export class TodoModule {}
