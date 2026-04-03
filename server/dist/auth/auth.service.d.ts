import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: number;
        email: string;
        name: string;
        roles: import("../role/entities/role.entity").Role[];
        createdAt: Date;
    } | null>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string;
            permissions: string[];
        };
    }>;
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string;
            permissions: string[];
        };
    }>;
    getProfile(userId: number): Promise<{
        permissions: string[];
        id: number;
        email: string;
        name: string;
        roles: import("../role/entities/role.entity").Role[];
        createdAt: Date;
    }>;
}
