import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { ProductsModule } from "./modules/products/products.module";
import { SalesModule } from "./modules/sales/sales.module";
import { FinanceModule } from "./modules/finance/finance.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { PrismaModule } from "./shared/prisma/prisma.module";
import { TenantModule } from "./shared/tenant";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        TenantModule,
        AuthModule,
        ProductsModule,
        SalesModule,
        FinanceModule,
        ReportsModule,
        SettingsModule,
        NotificationsModule,
    ],
})
export class AppModule { }

