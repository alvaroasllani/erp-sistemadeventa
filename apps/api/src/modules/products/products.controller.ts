import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../../shared/tenant";

@ApiTags("products")
@Controller("products")
@UseGuards(JwtAuthGuard, TenantGuard) // Require auth and tenant for all endpoints
@ApiBearerAuth()
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @ApiOperation({ summary: "Obtener todos los productos" })
    @ApiQuery({ name: "page", required: false })
    @ApiQuery({ name: "limit", required: false })
    @ApiQuery({ name: "search", required: false })
    @ApiQuery({ name: "categoryId", required: false })
    @ApiQuery({ name: "stockStatus", required: false })
    findAll(
        @Query("page") page?: string,
        @Query("limit") limit?: string,
        @Query("search") search?: string,
        @Query("categoryId") categoryId?: string,
        @Query("stockStatus") stockStatus?: string
    ) {
        const pageNum = parseInt(page || "1", 10);
        const limitNum = parseInt(limit || "20", 10);
        return this.productsService.findAll({
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            search,
            categoryId,
            stockStatus,
        });
    }

    @Get("low-stock")
    @ApiOperation({ summary: "Obtener productos con stock bajo" })
    getLowStock() {
        return this.productsService.getLowStock();
    }

    @Get(":id")
    @ApiOperation({ summary: "Obtener un producto por ID" })
    findOne(@Param("id") id: string) {
        return this.productsService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: "Crear un nuevo producto" })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Patch(":id")
    @ApiOperation({ summary: "Actualizar un producto" })
    update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Eliminar un producto" })
    remove(@Param("id") id: string) {
        return this.productsService.remove(id);
    }
}

