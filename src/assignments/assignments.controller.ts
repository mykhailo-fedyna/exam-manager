import { Body, Controller, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post(':courseId')
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Param('courseId') courseId: string, @Body() dto: any) {
    return this.assignmentsService.create(Number(courseId), dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() patch: any) {
    return this.assignmentsService.update(Number(id), patch);
  }
}
