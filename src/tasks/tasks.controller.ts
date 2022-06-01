import {
  Controller,
  Body,
  Param,
  Query,
  Get,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { Task } from './task.entity';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/create-tasks-filter.dto';
// import { Task } from './task.model';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.getAllTasks(filterDto);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }
  // @Get()
  // getAllTasks(): Task[] {
  //   return this.tasksService.getAllTasks();
  // }

  // @Get()
  // getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //   if (Object.keys(filterDto).length) {
  //     return this.tasksService.getTasksWithFilters(filterDto);
  //   } else {
  //     return this.tasksService.getAllTasks();
  //   }
  // }

  // @Get('/:id')
  // getTaskById(@Param('id') id: string): Task {
  //   return this.tasksService.getTaskById(id);
  // }

  // @Post()
  // createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //   return this.tasksService.createTask(createTaskDto);
  // }

  // @Delete('/:id')
  // remove(@Param('id') id: string): void {
  //   return this.tasksService.deleteTask(id);
  // }
}
