import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

export class UpdateSettingsDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do site é obrigatório.' })
  @MaxLength(255)
  site_name: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição do site é obrigatória.' })
  @MaxLength(500)
  site_description: string;

  @IsString()
  @IsOptional()
  logo_url?: string;

  @IsEmail({}, { message: 'Por favor, forneça um e-mail válido.' })
  @IsOptional()
  contact_email?: string;

  @IsArray()
  @IsOptional()
  footer_links?: any[];

  @IsArray()
  @IsOptional()
  social_links?: any[];
}
