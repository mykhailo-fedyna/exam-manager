import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { CoursesService } from './courses.service';
import store from '../store/in-memory.store';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() dto: CreateCourseDto) {
    const c = this.coursesService.create(dto as any);
    // invalidate cache
    return c;
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id/journal')
  getJournal(@Param('id') id: string) {
    const courseId = Number(id);
    const course = this.coursesService.findById(courseId);
    const enrolls = store.enrollments.filter((e) => e.courseId === courseId);
    const journal = enrolls.map((e) => {
      const student = store.students.find((s) => s.id === e.studentId);
      const subs = store.submissions.filter((s) => s.studentId === student.id && store.getAssignmentById(s.assignmentId).courseId === courseId);
      const totalPoints = subs.reduce((acc, s) => acc + s.points, 0);
      return { studentId: student.id, studentName: student.name, totalPoints };
    });
    return { course, journal };
  }
}
