import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CoursesModule } from './courses/courses.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { StudentsModule } from './students/students.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { EmailModule } from './email/email.module';
import { AppController } from './app.controller';

@Module({
  imports: [ScheduleModule.forRoot(), CoursesModule, AssignmentsModule, StudentsModule, SchedulerModule, EmailModule],
  controllers: [AppController],
})
export class AppModule {}
