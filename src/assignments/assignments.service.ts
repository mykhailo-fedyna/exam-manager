import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import store from '../store/in-memory.store';
import { CreateAssignmentDto, AssignmentType } from './dto/create-assignment.dto';
import { CreateExamVariantDto } from './dto/create-exam-variant.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class AssignmentsService {
  create(courseId: number, dto: CreateAssignmentDto) {
    const course = store.courses.find((c) => c.id === courseId);
    if (!course) throw new NotFoundException('Course not found');

    // Validate against course formula
    this.validateAssignmentAgainstFormula(courseId, dto);

    const assignment = { 
      id: store.nextId(), 
      courseId,
      ...dto,
      variants: [],
      submissions: []
    };
    store.assignments.push(assignment);
    return assignment;
  }

  update(id: number, patch: Partial<CreateAssignmentDto>) {
    const assignment = store.assignments.find((x) => x.id === id);
    if (!assignment) throw new NotFoundException('Assignment not found');
    
    // If updating points, validate against formula
    if (patch.maxPoints) {
      this.validateAssignmentAgainstFormula(assignment.courseId, { ...assignment, ...patch });
    }

    Object.assign(assignment, patch);
    return assignment;
  }

  addExamVariant(assignmentId: number, dto: CreateExamVariantDto) {
    const assignment = store.assignments.find((x) => x.id === assignmentId);
    if (!assignment) throw new NotFoundException('Assignment not found');
    
    if (assignment.type !== AssignmentType.EXAM) {
      throw new BadRequestException('Can only add variants to exam assignments');
    }

    // Validate total points match the exam points
    const totalPoints = dto.tasks.reduce((sum, task) => sum + task.points, 0);
    if (totalPoints !== assignment.maxPoints) {
      throw new BadRequestException(`Total points in variant (${totalPoints}) must match exam points (${assignment.maxPoints})`);
    }

    // Check if variant number already exists
    if (assignment.variants.some(v => v.variantNumber === dto.variantNumber)) {
      throw new BadRequestException('Variant number already exists');
    }

    assignment.variants.push(dto);
    return assignment;
  }

  private validateAssignmentAgainstFormula(courseId: number, dto: CreateAssignmentDto) {
    const course = store.courses.find((c) => c.id === courseId);
    const existingAssignments = store.assignments.filter(a => a.courseId === courseId);

    if (dto.type === AssignmentType.LAB) {
      // Check number of labs
      const labCount = existingAssignments.filter(a => a.type === AssignmentType.LAB).length;
      if (labCount >= course.formula.numberOfLabs) {
        throw new BadRequestException(`Cannot add more labs. Maximum allowed: ${course.formula.numberOfLabs}`);
      }

      // Check lab points
      if (dto.maxPoints !== course.formula.pointsPerLab) {
        throw new BadRequestException(`Lab points must be exactly ${course.formula.pointsPerLab}`);
      }
    }

    if (dto.type === AssignmentType.EXAM) {
      // Check if exam already exists
      const hasExam = existingAssignments.some(a => a.type === AssignmentType.EXAM);
      if (hasExam) {
        throw new BadRequestException('Course already has an exam');
      }

      // Check exam points
      if (dto.maxPoints !== course.formula.examPoints) {
        throw new BadRequestException(`Exam points must be exactly ${course.formula.examPoints}`);
      }
    }
  }

  submitAssignment(dto: CreateSubmissionDto) {
    const assignment = store.assignments.find(a => a.id === dto.assignmentId);
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const student = store.students.find(s => s.id === dto.studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Check if student is enrolled in the course
    const isEnrolled = store.enrollments.some(e => 
      e.studentId === dto.studentId && e.courseId === assignment.courseId
    );
    if (!isEnrolled) {
      throw new BadRequestException('Student is not enrolled in this course');
    }

    // Calculate penalty if past deadline
    let points = assignment.maxPoints;
    const submissionDate = new Date();
    if (submissionDate > assignment.deadline) {
      const daysLate = Math.floor((submissionDate.getTime() - assignment.deadline.getTime()) / (1000 * 60 * 60 * 24));
      const penalty = daysLate * assignment.penaltyPerDay;
      points = Math.max(0, points - penalty);
    }

    const submission = {
      id: store.nextId(),
      ...dto,
      submittedAt: submissionDate.toISOString(),
      points,
    };

    store.submissions.push(submission);
    return submission;
  }
}
