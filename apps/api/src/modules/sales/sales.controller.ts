import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { SalesService } from "./sales.service";
import { CreateSaleDto } from "./dto/sale.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../../shared/tenant";

@ApiTags("sales")
@Controller("sales")
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Crear una nueva venta" })
    create(
        @Body() createSaleDto: CreateSaleDto,
        @Request() req: { user: { userId: string } }
    ) {
        return this.salesService.create(createSaleDto, req.user.userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Obtener historial de ventas" })
    findAll(
        @Query("page") page?: string,
        @Query("limit") limit?: string
    ) {
        const pageNum = parseInt(page || "1", 10);
        const limitNum = parseInt(limit || "20", 10);
        return this.salesService.findAll({
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
        });
    }

    @Get("today-stats")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Estadísticas de ventas de hoy" })
    getTodayStats() {
        return this.salesService.getTodayStats();
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Obtener una venta por ID" })
    findOne(@Param("id") id: string) {
        return this.salesService.findOne(id);
    }
}
