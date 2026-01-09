import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { FinanceService } from "./finance.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../../shared/tenant";

@ApiTags("finance")
@Controller("finance")
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Get("transactions")
    @ApiOperation({ summary: "Obtener historial de transacciones" })
    getTransactions(
        @Query("page") page?: string,
        @Query("limit") limit?: string,
        @Query("type") type?: string
    ) {
        const pageNum = parseInt(page || "1", 10);
        const limitNum = parseInt(limit || "20", 10);
        return this.financeService.getTransactions({
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            type,
        });
    }

    @Get("dashboard")
    @ApiOperation({ summary: "Estadísticas para el dashboard" })
    getDashboardStats() {
        return this.financeService.getDashboardStats();
    }

    @Get("chart")
    @ApiOperation({ summary: "Datos del gráfico de ventas vs gastos" })
    getWeeklySalesChart() {
        return this.financeService.getWeeklySalesChart();
    }
}
