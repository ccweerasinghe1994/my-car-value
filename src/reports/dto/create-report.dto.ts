import {
  IsDecimal,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  @MaxLength(100)
  make: string;

  @IsString()
  @MaxLength(100)
  model: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsNumber()
  @Min(0)
  mileage: number;

  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  price: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
