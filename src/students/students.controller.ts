import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('enroll/:courseId')
  @UsePipes(new ValidationPipe({ transform: true }))
  enroll(@Param('courseId') courseId: string, @Body() body: any) {
    const student = this.studentsService.findOrCreateByEmail(body.email, body.name);
    // create enrollment
    return { courseId: Number(courseId), student };
  }
}
