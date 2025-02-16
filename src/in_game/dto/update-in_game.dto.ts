import { PartialType } from '@nestjs/mapped-types';
import { CreateInGameDto } from './create-in_game.dto';

export class UpdateInGameDto extends PartialType(CreateInGameDto) {
}
