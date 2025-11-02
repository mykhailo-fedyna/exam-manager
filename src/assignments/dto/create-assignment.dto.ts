import { IsString, IsNotEmpty, IsNumber, IsDate, IsPositive, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum AssignmentType {
  LAB = 'lab',
  EXAM = 'exam'
}

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(AssignmentType)
  type: AssignmentType;

  @IsDate()
  @Type(() => Date)
  deadline: Date;

  @IsNumber()
  @IsPositive()
  @Max(100)
  maxPoints: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  penaltyPerDay: number;
}