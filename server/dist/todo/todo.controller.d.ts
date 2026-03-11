import { TodoService } from './todo.service';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    findAll(): Promise<import("./entities/todo.entity").Todo[]>;
    findOne(id: number): Promise<import("./entities/todo.entity").Todo>;
    create(createTodoDto: CreateTodoDto): Promise<import("./entities/todo.entity").Todo>;
    update(id: number, updateTodoDto: UpdateTodoDto): Promise<import("./entities/todo.entity").Todo>;
    remove(id: number): Promise<void>;
    toggle(id: number): Promise<import("./entities/todo.entity").Todo>;
}
