import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

const trimIfString = (value: unknown): unknown => {
  if (typeof value === 'string') return value.trim();
  return value;
};

export class UpdateUserDto {
  @IsOptional()
  @Transform(({ value }) => trimIfString(value as unknown))
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  fullName?: string;
}
