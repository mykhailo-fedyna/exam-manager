import { Body, Controller, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { CreateExamVariantDto } from './dto/create-exam-variant.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post(':courseId')
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Param('courseId') courseId: string, @Body() dto: CreateAssignmentDto) {
    return this.assignmentsService.create(Number(courseId), dto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() patch: Partial<CreateAssignmentDto>) {
    return this.assignmentsService.update(Number(id), patch);
  }

  @Post(':id/variants')
  @UsePipes(new ValidationPipe({ transform: true }))
  addExamVariant(@Param('id') id: string, @Body() dto: CreateExamVariantDto) {
    return this.assignmentsService.addExamVariant(Number(id), dto);
  }

  @Post('submit')
  @UsePipes(new ValidationPipe({ transform: true }))
  submit(@Body() dto: CreateSubmissionDto) {
    return this.assignmentsService.submitAssignment(dto);
  }
}
