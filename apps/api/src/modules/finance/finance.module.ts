import { Module } from "@nestjs/common";
import { FinanceController } from "./finance.controller";
import { FinanceService } from "./finance.service";
import { SalesModule } from "../sales/sales.module";

@Module({
    imports: [SalesModule],
    controllers: [FinanceController],
    providers: [FinanceService],
})
export class FinanceModule { }
