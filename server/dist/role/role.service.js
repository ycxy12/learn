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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("./entities/role.entity");
let RoleService = class RoleService {
    roleRepo;
    constructor(roleRepo) {
        this.roleRepo = roleRepo;
    }
    async create(createRoleDto) {
        const existingRole = await this.roleRepo.findOneBy({
            code: createRoleDto.code,
        });
        if (existingRole) {
            throw new common_1.ConflictException(`角色编码 ${createRoleDto.code} 已被占用`);
        }
        const role = this.roleRepo.create(createRoleDto);
        return this.roleRepo.save(role);
    }
    async findAll() {
        return this.roleRepo.find({
            order: { id: 'DESC' },
        });
    }
    async findOne(id) {
        const role = await this.roleRepo.findOneBy({ id });
        if (!role) {
            throw new common_1.NotFoundException(`角色 #${id} 不存在`);
        }
        return role;
    }
    async update(id, updateRoleDto) {
        const role = await this.findOne(id);
        if (updateRoleDto.code && updateRoleDto.code !== role.code) {
            const existingRole = await this.roleRepo.findOneBy({
                code: updateRoleDto.code,
            });
            if (existingRole) {
                throw new common_1.ConflictException(`角色编码 ${updateRoleDto.code} 已被占用`);
            }
        }
        Object.assign(role, updateRoleDto);
        return this.roleRepo.save(role);
    }
    async remove(id) {
        const role = await this.findOne(id);
        return this.roleRepo.remove(role);
    }
    async getRoleMenus(id) {
        const role = await this.roleRepo.findOne({
            where: { id },
            relations: ['menus'],
        });
        if (!role) {
            throw new common_1.NotFoundException(`角色 #${id} 不存在`);
        }
        return role.menus;
    }
    async assignMenus(id, menuIds) {
        const role = await this.roleRepo.findOne({ where: { id } });
        if (!role) {
            throw new common_1.NotFoundException(`角色 #${id} 不存在`);
        }
        role.menus = menuIds.map((menuId) => ({ id: menuId }));
        await this.roleRepo.save(role);
        return this.getRoleMenus(id);
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoleService);
//# sourceMappingURL=role.service.js.map