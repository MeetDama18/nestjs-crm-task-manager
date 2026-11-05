import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { TaskStatus } from '../../../common/enums/task-status.enum';
import { TaskPriority } from '../../../common/enums/task-priority.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status must be todo, in_progress, or done' })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Priority must be low, medium, or high' })
  priority?: TaskPriority;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsUUID('4', { message: 'customerId must be a valid UUID' })
  @IsNotEmpty({ message: 'Customer ID is required' })
  customerId: string;
}