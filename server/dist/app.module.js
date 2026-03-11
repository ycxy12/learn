"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const todo_module_1 = require("./todo/todo.module");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const menu_module_1 = require("./menu/menu.module");
const todo_entity_1 = require("./todo/entities/todo.entity");
const user_entity_1 = require("./user/entities/user.entity");
const menu_entity_1 = require("./menu/entities/menu.entity");
const role_entity_1 = require("./role/entities/role.entity");
const role_module_1 = require("./role/role.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'data.db',
                entities: [todo_entity_1.Todo, user_entity_1.User, menu_entity_1.Menu, role_entity_1.Role],
                synchronize: true,
                logging: ['error'],
            }),
            todo_module_1.TodoModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            menu_module_1.MenuModule,
            role_module_1.RoleModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map