import { IsString, IsNumber, IsOptional, IsEnum, Min } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { ProductStatus } from "@prisma/client";

export class CreateProductDto {
    @ApiProperty({ example: "FER-001" })
    @IsString()
    sku: string;

    @ApiProperty({ example: "Martillo Profesional Stanley" })
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ required: false, description: "Category ID (dynamic per tenant)" })
    @IsString()
    @IsOptional()
    categoryId?: string;

    @ApiProperty({ example: 120 })
    @IsNumber()
    @Min(0)
    costPrice: number;

    @ApiProperty({ example: 189 })
    @IsNumber()
    @Min(0)
    salePrice: number;

    @ApiProperty({ example: 45 })
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty({ example: 5 })
    @IsNumber()
    @Min(0)
    @IsOptional()
    minStock?: number;

    @ApiProperty({ enum: ProductStatus, required: false })
    @IsEnum(ProductStatus)
    @IsOptional()
    status?: ProductStatus;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    image?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) { }

