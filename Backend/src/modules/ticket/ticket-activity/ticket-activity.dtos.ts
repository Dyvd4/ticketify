import { IsNumber, IsOptional } from "class-validator";

export class FindAllQueryDto {
    @IsNumber()
    @IsOptional()
    ticketId?: number;
}
