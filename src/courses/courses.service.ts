import { Injectable, NotFoundException } from '@nestjs/common';
import store from '../store/in-memory.store';

@Injectable()
export class CoursesService {
  create(dto: { code: string; name: string; description?: string }) {
    if (store.courses.find((c) => c.code === dto.code)) {
      throw new Error('Course with this code already exists');
    }
    const course = { id: store.nextId(), ...dto, createdAt: new Date().toISOString() };
    store.courses.push(course);
    return course;
  }

  findAll() {
    return store.courses;
  }

  findById(id: number) {
    const course = store.courses.find((c) => c.id === id);
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
}
