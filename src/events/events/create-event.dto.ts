import { Type } from 'class-transformer';

export class CreateEventDto {
  name: string;
  description: string;
  @Type(() => Date)
  date: Date;
  partner_id: string;
}
