"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UserService = class UserService {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async findByEmail(email) {
        return this.userRepo.findOne({
            where: { email },
            relations: ['roles'],
        });
    }
    async findById(id) {
        return this.userRepo.findOne({
            where: { id },
            relations: ['roles'],
        });
    }
    async create(data) {
        const existing = await this.findByEmail(data.email);
        if (existing) {
            throw new common_1.ConflictException('邮箱已存在');
        }
        const { roleIds, ...userData } = data;
        const userToSave = { ...userData };
        if (roleIds) {
            userToSave.roles = roleIds.map((id) => ({ id }));
        }
        const user = this.userRepo.create(userToSave);
        return this.userRepo.save(user);
    }
    async findAll() {
        return this.userRepo.find({
            order: { createdAt: 'DESC' },
            relations: ['roles'],
        });
    }
    async update(id, data) {
        const { roleIds, ...userData } = data;
        if (Object.keys(userData).length > 0) {
            await this.userRepo.update(id, userData);
        }
        if (roleIds !== undefined) {
            const user = await this.findById(id);
            if (user) {
                user.roles = roleIds.map((roleId) => ({ id: roleId }));
                await this.userRepo.save(user);
            }
        }
        return this.findById(id);
    }
    async remove(id) {
        await this.userRepo.delete(id);
    }
    async getUserPermissions(id) {
        const user = await this.userRepo.findOne({
            where: { id },
            relations: ['roles', 'roles.menus'],
        });
        if (!user)
            return [];
        const permsSet = new Set();
        for (const role of user.roles || []) {
            for (const menu of role.menus || []) {
                if (menu.perms) {
                    permsSet.add(menu.perms);
                }
            }
        }
        return Array.from(permsSet);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map