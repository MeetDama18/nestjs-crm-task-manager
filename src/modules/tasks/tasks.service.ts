import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../users/entities/user.entity';
import { Role } from '../../common/enums/role.enum';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly customersService: CustomersService,
  ) {}

  // 1. Create task: attached to customer and current logged-in user
  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    // Validate customer exists
    await this.customersService.findOne(createTaskDto.customerId);

    const task = this.taskRepository.create({
      ...createTaskDto,
      userId: user.id,
    });

    return this.taskRepository.save(task);
  }

  // 2. Find all tasks with filters and role-based scoping
  async findAll(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, priority, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.customer', 'customer')
      .leftJoinAndSelect('task.user', 'user');

    // Scoping: normal users only see their own tasks; admins see everything
    if (user.role !== Role.ADMIN) {
      query.andWhere('task.userId = :userId', { userId: user.id });
    }

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (priority) {
      query.andWhere('task.priority = :priority', { priority });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return query.orderBy('task.createdAt', 'DESC').getMany();
  }

  // 3. Find one with access check
  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
  where: { id },
  relations: {
    customer: true,
    user: true,
  },
});

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (user.role !== Role.ADMIN && task.userId !== user.id) {
      throw new ForbiddenException('You do not have permission to access this task');
    }

    return task;
  }

  // 4. Update task
  async update(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.findOne(id, user);

    if (updateTaskDto.customerId) {
      await this.customersService.findOne(updateTaskDto.customerId);
    }

    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  // 5. Delete task
  async remove(id: string, user: User): Promise<{ message: string }> {
    const task = await this.findOne(id, user);
    await this.taskRepository.remove(task);
    return { message: 'Task deleted successfully' };
  }
}