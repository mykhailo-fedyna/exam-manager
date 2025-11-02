import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  health() {
    return { status: 'ok', message: 'Exam-manager Nest starter is running' };
  }

  @Get('routes')
  routes() {
    return {
      routes: [
        { method: 'GET', path: '/' },
        { method: 'GET', path: '/routes' },
        { method: 'POST', path: '/courses' },
        { method: 'GET', path: '/courses' },
        { method: 'GET', path: '/courses/:id/journal' },
        { method: 'POST', path: '/assignments/:courseId' },
        { method: 'PATCH', path: '/assignments/:id' },
        { method: 'POST', path: '/students/enroll/:courseId' }
      ],
    };
  }
}
