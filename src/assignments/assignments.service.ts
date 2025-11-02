import { Injectable, NotFoundException } from '@nestjs/common';
import store from '../store/in-memory.store';

@Injectable()
export class AssignmentsService {
  create(courseId: number, dto: any) {
    const course = store.courses.find((c) => c.id === courseId);
    if (!course) throw new NotFoundException('Course not found');
    const assignment = { id: store.nextId(), courseId, ...dto };
    store.assignments.push(assignment);
    return assignment;
  }

  update(id: number, patch: any) {
    const a = store.assignments.find((x) => x.id === id);
    if (!a) throw new NotFoundException('Assignment not found');
    Object.assign(a, patch);
    return a;
  }
}
