import { Injectable } from '@nestjs/common';
import store from '../store/in-memory.store';

@Injectable()
export class StudentsService {
  findOrCreateByEmail(email: string, name: string) {
    let s = store.students.find((x) => x.email === email);
    if (!s) {
      s = { id: store.nextId(), email, name };
      store.students.push(s);
    }
    return s;
  }
}
