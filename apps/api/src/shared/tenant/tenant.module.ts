import { Global, Module } from "@nestjs/common";
import { TenantPrismaService } from "./tenant-prisma.service";
import { TenantGuard } from "./tenant.guard";
import { PrismaModule } from "../prisma/prisma.module";

/**
 * TenantModule - Provides tenant-aware services globally
 * 
 * This module provides:
 * - TenantPrismaService: Request-scoped Prisma with auto tenant filtering
 * - TenantGuard: Route guard for tenant validation
 */
@Global()
@Module({
    imports: [PrismaModule],
    providers: [
        TenantPrismaService,
        TenantGuard,
    ],
    exports: [
        TenantPrismaService,
        TenantGuard,
    ],
})
export class TenantModule { }

