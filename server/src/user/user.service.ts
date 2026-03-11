/**
 * 📚 第四阶段 - User Service
 */

import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ 
      where: { email },
      relations: ['roles'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async create(data: Partial<User> & { roleIds?: number[] }): Promise<User> {
    const existing = await this.findByEmail(data.email!);
    if (existing) {
      throw new ConflictException('邮箱已存在');
    }
    
    // Convert roleIds to roles array format for TypeORM ManyToMany
    const { roleIds, ...userData } = data;
    const userToSave = { ...userData } as User;
    if (roleIds) {
      userToSave.roles = roleIds.map((id) => ({ id }) as Role);
    }

    const user = this.userRepo.create(userToSave);
    return this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['roles'],
    });
  }

  async update(
    id: number,
    data: Partial<User> & { roleIds?: number[] },
  ): Promise<User> {
    const { roleIds, ...userData } = data;
    
    // For scalar attributes
    if (Object.keys(userData).length > 0) {
      await this.userRepo.update(id, userData);
    }
    
    // For many-to-many relationship we need to save the relations 
    if (roleIds !== undefined) {
      const user = await this.findById(id);
      if (user) {
        user.roles = roleIds.map((roleId) => ({ id: roleId }) as Role);
        await this.userRepo.save(user);
      }
    }
    
    return this.findById(id) as Promise<User>;
  }

  async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
}
