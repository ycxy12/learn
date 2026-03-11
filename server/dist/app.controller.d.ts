import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getHelloName(name: string): string;
    greet(name: string, age?: string): object;
    createUser(body: {
        name: string;
        email: string;
    }): object;
    getInfo(): object;
}
