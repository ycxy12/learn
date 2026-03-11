export declare class AppService {
    getHello(): string;
    getUserById(id: number): object | null;
    getAllUsers(): Promise<object[]>;
}
