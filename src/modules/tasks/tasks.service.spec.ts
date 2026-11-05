import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CustomersService } from '../customers/customers.service';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskPriority } from '../../common/enums/task-priority.enum';
import { Role } from '../../common/enums/role.enum';
import { User } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

// Intercept @nestjs/typeorm so it never loads the broken ESM build while
// preserving the metadata Nest needs to resolve repository dependencies.
jest.mock('@nestjs/typeorm', () => {
  const { Inject } = jest.requireActual('@nestjs/common');

  return {
    InjectRepository: (entity: any) => Inject(`${entity.name}Repository`),
    getRepositoryToken: (entity: any) => `${entity.name}Repository`,
  };
});

describe('TasksService', () => {
  let service: TasksService;
  let mockTaskRepository: any;
  let mockCustomersService: any;

  const mockUser: User = {
    id: 'user-uuid-1',
    email: 'user@crm.com',
    password: 'hashedpassword',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTask: Task = {
    id: 'task-uuid-1',
    title: 'Test Task',
    description: 'Testing task description',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date(),
    userId: 'user-uuid-1',
    customerId: 'customer-uuid-1',
    user: mockUser,
    customer: null as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockTaskRepository = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((task) =>
        Promise.resolve({ id: 'task-uuid-1', ...task }),
      ),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockTask]),
      })),
      remove: jest.fn().mockResolvedValue(mockTask),
    };

    mockCustomersService = {
      findOne: jest
        .fn()
        .mockResolvedValue({ id: 'customer-uuid-1', name: 'Test Corp' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: 'TaskRepository',
          useValue: mockTaskRepository,
        },
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a task assigned to current user', async () => {
      const dto = {
        title: 'New Task',
        customerId: 'customer-uuid-1',
      };

      const result = await service.create(dto, mockUser);
      expect(mockCustomersService.findOne).toHaveBeenCalledWith(
        'customer-uuid-1',
      );
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...dto,
        userId: mockUser.id,
      });
      expect(result).toHaveProperty('id', 'task-uuid-1');
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if task does not exist', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return the task if found and owned by user', async () => {
      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne('task-uuid-1', mockUser);
      expect(result).toEqual(mockTask);
    });
  });
});