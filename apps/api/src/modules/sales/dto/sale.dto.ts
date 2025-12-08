import { IsArray, IsEnum, IsOptional, IsString, ValidateNested, IsNumber, Min, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod } from "@prisma/client";

class SaleItemDto {
    @ApiProperty()
    @IsString()
    productId: string;

    @ApiProperty({ example: 2 })
    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateSaleDto {
    @ApiProperty({ type: [SaleItemDto] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => SaleItemDto)
    items: SaleItemDto[];

    @ApiProperty({ enum: ["cash", "card", "qr"], example: "cash" })
    @IsEnum(["cash", "card", "qr"])
    paymentMethod: "cash" | "card" | "qr";

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    customerId?: string;
}
