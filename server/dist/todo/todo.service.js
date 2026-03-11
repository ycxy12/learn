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
exports.TodoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const todo_entity_1 = require("./entities/todo.entity");
let TodoService = class TodoService {
    todoRepo;
    constructor(todoRepo) {
        this.todoRepo = todoRepo;
    }
    async findAll() {
        return this.todoRepo.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const todo = await this.todoRepo.findOneBy({ id });
        if (!todo) {
            throw new common_1.NotFoundException(`Todo #${id} 不存在`);
        }
        return todo;
    }
    async create(dto) {
        const todo = this.todoRepo.create(dto);
        return this.todoRepo.save(todo);
    }
    async update(id, dto) {
        const todo = await this.findOne(id);
        Object.assign(todo, dto);
        return this.todoRepo.save(todo);
    }
    async remove(id) {
        const todo = await this.findOne(id);
        await this.todoRepo.remove(todo);
    }
    async toggle(id) {
        const todo = await this.findOne(id);
        todo.completed = !todo.completed;
        return this.todoRepo.save(todo);
    }
};
exports.TodoService = TodoService;
exports.TodoService = TodoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(todo_entity_1.Todo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TodoService);
//# sourceMappingURL=todo.service.js.map