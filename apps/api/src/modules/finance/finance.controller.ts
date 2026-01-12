import { Controller, Get, Post, Delete, Body, Query, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { FinanceService } from "./finance.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../../shared/tenant";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@ApiTags("finance")
@Controller("finance")
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Get()
    @ApiOperation({ summary: "Obtener historial de transacciones" })
    getTransactions(
        @Query("page") page?: string,
        @Query("limit") limit?: string,
        @Query("type") type?: string,
        @Query("startDate") startDate?: string,
        @Query("endDate") endDate?: string,
        @Query("includeDeleted") includeDeleted?: string
    ) {
        const pageNum = parseInt(page || "1", 10);
        const limitNum = parseInt(limit || "20", 10);
        return this.financeService.getTransactions({
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            type,
            startDate,
            endDate,
            includeDeleted: includeDeleted === "true"
        });
    }

    @Post()
    @ApiOperation({ summary: "Registrar transacción manual (Gasto/Ingreso)" })
    create(@Body() data: CreateTransactionDto) {
        return this.financeService.createTransaction(data);
    }

    @Get("dashboard")
    @ApiOperation({ summary: "Estadísticas para el dashboard" })
    getDashboardStats() {
        return this.financeService.getDashboardStats();
    }

    @Get("chart")
    @ApiOperation({ summary: "Gráfico de ventas semanales" })
    getWeeklyChart() {
        return this.financeService.getWeeklySalesChart();
    }

    @Get("deleted")
    @ApiOperation({ summary: "Historial de transacciones eliminadas (auditoría)" })
    getDeletedTransactions() {
        return this.financeService.getDeletedTransactions();
    }

    @Delete(":id")
    @ApiOperation({ summary: "Eliminar transacción o anular venta" })
    delete(@Param("id") id: string) {
        return this.financeService.deleteTransaction(id);
    }
}
