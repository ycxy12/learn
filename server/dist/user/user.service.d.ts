import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UserService {
    private userRepo;
    constructor(userRepo: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(data: Partial<User> & {
        roleIds?: number[];
    }): Promise<User>;
    findAll(): Promise<User[]>;
    update(id: number, data: Partial<User> & {
        roleIds?: number[];
    }): Promise<User>;
    remove(id: number): Promise<void>;
    getUserPermissions(id: number): Promise<string[]>;
}
