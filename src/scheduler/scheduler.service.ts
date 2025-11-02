import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import store from '../store/in-memory.store';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  @Cron('* * * * *')
  handleCron() {
    // simple penalty application: for each submission past deadline, subtract penalty
    this.logger.debug('Running scheduled penalty job');
    const now = new Date();
    store.assignments.forEach((a) => {
      if (!a.deadline) return;
      const dl = new Date(a.deadline);
      if (dl < now && a.penaltyPerDay) {
        store.submissions.forEach((s) => {
          if (s.assignmentId === a.id && !s.penaltyApplied) {
            const submittedAt = new Date(s.submittedAt);
            const daysLate = Math.ceil((submittedAt.getTime() - dl.getTime()) / (1000 * 60 * 60 * 24));
            if (daysLate > 0) {
              const penalty = daysLate * a.penaltyPerDay;
              s.points = Math.max(0, s.points - penalty);
              s.penaltyApplied = true;
            }
          }
        });
      }
    });
  }
}
