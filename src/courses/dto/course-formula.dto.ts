import { IsNumber, IsPositive, Min, Max } from 'class-validator';

export class CourseFormulaDto {
  @IsNumber()
  @IsPositive()
  @Max(10)
  numberOfLabs: number;

  @IsNumber()
  @IsPositive()
  @Max(20)
  pointsPerLab: number;

  @IsNumber()
  @IsPositive()
  @Min(20)
  @Max(60)
  examPoints: number;
}