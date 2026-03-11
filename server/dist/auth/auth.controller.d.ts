import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>;
    getProfile(req: {
        user: {
            userId: number;
        };
    }): Promise<{
        id: number;
        email: string;
        name: string;
        roles: import("../role/entities/role.entity").Role[];
        createdAt: Date;
    }>;
}
