import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ExamTaskDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsNumber()
  @Min(1)
  points: number;
}

export class CreateExamVariantDto {
  @IsNumber()
  @Min(1)
  variantNumber: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamTaskDto)
  tasks: ExamTaskDto[];
}