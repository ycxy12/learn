/**
 * 📚 NestJS 进阶 - Todo Service
 *
 * Service 封装业务逻辑，使用 Repository 操作数据库
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepo: Repository<Todo>,
  ) {}

  /**
   * 获取所有 Todo
   */
  async findAll(): Promise<Todo[]> {
    return this.todoRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 根据 ID 获取单个 Todo
   */
  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepo.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo #${id} 不存在`);
    }
    return todo;
  }

  /**
   * 创建新 Todo
   */
  async create(dto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepo.create(dto);
    return this.todoRepo.save(todo);
  }

  /**
   * 更新 Todo
   */
  async update(id: number, dto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, dto);
    return this.todoRepo.save(todo);
  }

  /**
   * 删除 Todo
   */
  async remove(id: number): Promise<void> {
    const todo = await this.findOne(id);
    await this.todoRepo.remove(todo);
  }

  /**
   * 切换完成状态
   */
  async toggle(id: number): Promise<Todo> {
    const todo = await this.findOne(id);
    todo.completed = !todo.completed;
    return this.todoRepo.save(todo);
  }
}
