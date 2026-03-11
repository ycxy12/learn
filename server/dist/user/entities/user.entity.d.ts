import { Role } from '../../role/entities/role.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    roles: Role[];
    createdAt: Date;
}
