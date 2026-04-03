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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateRoleDto {
    name;
    code;
    description;
}
exports.CreateRoleDto = CreateRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '角色名称', example: '管理员' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 50, { message: '角色名称长度必须在2到50个字符之间' }),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '角色编码', example: 'admin' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 50, { message: '角色编码长度必须在2到50个字符之间' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z_]+$/, { message: '角色编码只能包含英文字母和下划线' }),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '角色描述', example: '管理员角色' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(0, 200, { message: '角色描述长度不能超过200个字符' }),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "description", void 0);
//# sourceMappingURL=create-role.dto.js.map