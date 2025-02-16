import { IsString } from "class-validator";

export class SendAnswerDto {
  @IsString()
  token: string
  id: string
  answer: string
}
