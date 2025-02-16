import { IsString } from 'class-validator';
export class DeleteQuizRemoveDto {
  @IsString()
  id: string;
}
