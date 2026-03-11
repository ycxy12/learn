import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
export declare class TodoService {
    private todoRepo;
    constructor(todoRepo: Repository<Todo>);
    findAll(): Promise<Todo[]>;
    findOne(id: number): Promise<Todo>;
    create(dto: CreateTodoDto): Promise<Todo>;
    update(id: number, dto: UpdateTodoDto): Promise<Todo>;
    remove(id: number): Promise<void>;
    toggle(id: number): Promise<Todo>;
}
