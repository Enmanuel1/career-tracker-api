import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const trimIfString = (value: unknown): unknown => {
  if (typeof value === 'string') return value.trim();
  return value;
};

const normalizeEmail = (value: unknown): unknown => {
  if (typeof value !== 'string') return value;
  return value.trim().toLowerCase();
};

export class CreateUserDto {
  @Transform(({ value }) => normalizeEmail(value as unknown))
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @Transform(({ value }) => trimIfString(value as unknown))
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  fullName?: string;
}
