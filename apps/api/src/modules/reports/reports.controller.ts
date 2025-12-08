import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { ReportsService } from "./reports.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("reports")
@Controller("reports")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get("sales")
    @ApiOperation({ summary: "Reporte de ventas" })
    @ApiQuery({ name: "startDate", required: true })
    @ApiQuery({ name: "endDate", required: true })
    getSalesReport(
        @Query("startDate") startDate: string,
        @Query("endDate") endDate: string
    ) {
        return this.reportsService.getSalesReport(
            new Date(startDate),
            new Date(endDate)
        );
    }

    @Get("inventory")
    @ApiOperation({ summary: "Reporte de inventario" })
    getInventoryReport() {
        return this.reportsService.getInventoryReport();
    }

    @Get("top-products")
    @ApiOperation({ summary: "Productos más vendidos" })
    @ApiQuery({ name: "startDate", required: true })
    @ApiQuery({ name: "endDate", required: true })
    @ApiQuery({ name: "limit", required: false })
    getTopProducts(
        @Query("startDate") startDate: string,
        @Query("endDate") endDate: string,
        @Query("limit") limit?: string
    ) {
        return this.reportsService.getTopProducts(
            new Date(startDate),
            new Date(endDate),
            parseInt(limit || "10", 10)
        );
    }
}
