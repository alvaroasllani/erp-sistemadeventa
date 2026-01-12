import { Injectable, Scope, Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Prisma } from "@prisma/client";
import { Request } from "express";
import { PrismaService } from "../prisma/prisma.service";

/**
 * TenantPrismaService - Request-scoped Prisma client with automatic tenant filtering
 * 
 * This service automatically injects tenantId into all queries, providing
 * built-in isolation between tenants (Layer 3 of our security model).
 * 
 * IMPORTANT: Uses shared PrismaService to avoid connection pool exhaustion.
 */
@Injectable({ scope: Scope.REQUEST })
export class TenantPrismaService {
    constructor(
        @Inject(REQUEST) private readonly request: Request,
        private readonly prisma: PrismaService
    ) { }

    /**
     * Get tenantId from the request - called at query time to ensure
     * JwtAuthGuard has already populated request.user
     */
    private getTenantIdFromRequest(): string | null {
        return (this.request as any).user?.tenantId || (this.request as any).tenantId || null;
    }

    /**
     * Auto-inject tenantId into where clause
     */
    private injectTenantWhere(args: any): any {
        const tenantId = this.getTenantIdFromRequest();
        if (tenantId) {
            args.where = { ...args.where, tenantId };
        }
        return args;
    }

    /**
     * Auto-inject tenantId into create data
     */
    private injectTenantData(args: any): any {
        const tenantId = this.getTenantIdFromRequest();
        if (tenantId) {
            if (Array.isArray(args.data)) {
                args.data = args.data.map((item: any) => ({ ...item, tenantId }));
            } else {
                args.data = { ...args.data, tenantId };
            }
        }
        return args;
    }

    // Expose Prisma models with tenant filtering proxies
    get user() {
        return this.createTenantProxy(this.prisma.user);
    }

    get product() {
        return this.createTenantProxy(this.prisma.product);
    }

    get category() {
        return this.createTenantProxy(this.prisma.category);
    }

    get sale() {
        return this.createTenantProxy(this.prisma.sale);
    }

    get saleItem() {
        // SaleItem doesn't have direct tenantId
        return this.prisma.saleItem;
    }

    get customer() {
        return this.createTenantProxy(this.prisma.customer);
    }

    get transaction() {
        return this.createTenantProxy(this.prisma.transaction);
    }

    get companySettings() {
        return this.createTenantProxy(this.prisma.companySettings);
    }

    get deletedTransaction() {
        return this.createTenantProxy(this.prisma.deletedTransaction);
    }

    // Tenant model is accessible without filtering
    get tenant() {
        return this.prisma.tenant;
    }

    /**
     * Create a proxy that auto-injects tenantId
     */
    private createTenantProxy<T extends object>(model: T): T {
        const self = this;
        return new Proxy(model, {
            get(target, prop) {
                const original = (target as any)[prop];
                if (typeof original !== "function") {
                    return original;
                }

                return async (args: any = {}) => {
                    const tenantId = self.getTenantIdFromRequest();

                    // Skip tenant filtering if no tenantId (unauthenticated routes)
                    if (!tenantId) {
                        return original.call(target, args);
                    }

                    // Inject tenantId based on operation type
                    if (prop === "create" || prop === "createMany") {
                        args = self.injectTenantData(args);
                    } else if (["findMany", "findFirst", "findUnique", "update", "updateMany", "delete", "deleteMany", "count", "aggregate"].includes(prop as string)) {
                        args = self.injectTenantWhere(args);
                    }

                    return original.call(target, args);
                };
            },
        });
    }

    // Transaction support - use shared prisma instance
    async $transaction<T>(fn: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T> {
        return this.prisma.$transaction(fn);
    }

    // Get current tenant ID
    getTenantId(): string | null {
        return this.getTenantIdFromRequest();
    }
}


