import { IsString } from "class-validator";

export class CreateInGameDto {
  @IsString()
  token: string
  id: string
}
