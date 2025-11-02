import { IsNumber, IsPositive } from 'class-validator';

export class CreateSubmissionDto {
  @IsNumber()
  @IsPositive()
  studentId: number;

  @IsNumber()
  @IsPositive()
  assignmentId: number;

  content: string;
}