import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateNoteDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}
