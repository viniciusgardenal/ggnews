import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da categoria é obrigatório.' })
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'O slug é obrigatório.' })
  @MaxLength(255)
  slug: string;
}
