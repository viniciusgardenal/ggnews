import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da categoria é obrigatório.' })
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  slug?: string;
}
