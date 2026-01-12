import { IsString, IsNumber, IsEnum, IsOptional, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTransactionDto {
    @ApiProperty({ enum: ["SALE", "EXPENSE", "REFUND"] })
    @IsEnum(["SALE", "EXPENSE", "REFUND"])
    type: "SALE" | "EXPENSE" | "REFUND";

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    amount: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiProperty({ enum: ["CASH", "CARD", "QR", "TRANSFER"], required: false })
    @IsEnum(["CASH", "CARD", "QR", "TRANSFER"])
    @IsOptional()
    method?: "CASH" | "CARD" | "QR" | "TRANSFER";
}
