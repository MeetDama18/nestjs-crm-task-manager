import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../../../common/enums/task-status.enum';
import { TaskPriority } from '../../../common/enums/task-priority.enum';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsString()
  search?: string; // Searches in title or description
}