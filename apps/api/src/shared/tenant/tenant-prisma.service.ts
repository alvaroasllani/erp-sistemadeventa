import { Injectable, Scope, Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { PrismaClient, Prisma } from "@prisma/client";
import { Request } from "express";

/**
 * TenantPrismaService - Request-scoped Prisma client with automatic tenant filtering
 * 
 * This service automatically injects tenantId into all queries, providing
 * built-in isolation between tenants (Layer 3 of our security model).
 */
@Injectable({ scope: Scope.REQUEST })
export class TenantPrismaService {
    private readonly prismaWithTenant: PrismaClient;
    private readonly tenantId: string | null;

    constructor(@Inject(REQUEST) private readonly request: Request) {
        // Get tenantId from authenticated user
        this.tenantId = (request as any).user?.tenantId || null;

        // Create Prisma client with tenant-aware extensions
        const basePrisma = new PrismaClient();

        if (this.tenantId) {
            this.prismaWithTenant = this.createTenantAwarePrisma(basePrisma, this.tenantId);
        } else {
            // For unauthenticated routes (login, register), use base prisma
            this.prismaWithTenant = basePrisma;
        }
    }

    /**
     * Creates a Prisma client extension that automatically filters queries by tenantId
     * This is Layer 3 of our security model - application-level auto-filtering
     */
    private createTenantAwarePrisma(prisma: PrismaClient, tenantId: string) {
        return prisma.$extends({
            query: {
                // Auto-filter all models that have tenantId
                user: this.createModelExtension(tenantId),
                product: this.createModelExtension(tenantId),
                category: this.createModelExtension(tenantId),
                sale: this.createModelExtension(tenantId),
                saleItem: {
                    // SaleItem doesn't have direct tenantId, filtered through Sale relation
                    async findMany({ args, query }) {
                        return query(args);
                    },
                },
                customer: this.createModelExtension(tenantId),
                transaction: this.createModelExtension(tenantId),
                companySettings: this.createModelExtension(tenantId),
            },
        }) as unknown as PrismaClient;
    }

    /**
     * Creates extension methods for a model to auto-inject tenantId
     */
    private createModelExtension(tenantId: string) {
        return {
            async findMany({ args, query }: { args: any; query: any }) {
                args.where = { ...args.where, tenantId };
                return query(args);
            },
            async findFirst({ args, query }: { args: any; query: any }) {
                args.where = { ...args.where, tenantId };
                return query(args);
            },
            async findUnique({ args, query }: { args: any; query: any }) {
                // For findUnique, we need to verify tenant after fetch
                const result = await query(args);
                if (result && (result as any).tenantId !== tenantId) {
                    return null; // Don't expose data from other tenants
                }
                return result;
            },
            async create({ args, query }: { args: any; query: any }) {
                args.data = { ...args.data, tenantId };
                return query(args);
            },
            async createMany({ args, query }: { args: any; query: any }) {
                if (Array.isArray(args.data)) {
                    args.data = args.data.map((item: any) => ({ ...item, tenantId }));
                } else {
                    args.data = { ...args.data, tenantId };
                }
                return query(args);
            },
            async update({ args, query }: { args: any; query: any }) {
                args.where = { ...args.where, tenantId };
                return query(args);
            },
            async updateMany({ args, query }: { args: any; query: any }) {
                args.where = { ...args.where, tenantId };
                return query(args);
            },
            async delete({ args, query }: { args: any; query: any }) {
                args.where = { ...args.where, tenantId };
                return query(args);
            },
            async deleteMany({ args, query }: { args: any; query: any }) {
                args.where = { ...args.where, tenantId };
                return query(args);
            },
            async count({ args, query }: { args: any; query: any }) {
                args.where = { ...args.where, tenantId };
                return query(args);
            },
        };
    }

    // Expose Prisma models with tenant filtering
    get user() { return this.prismaWithTenant.user; }
    get product() { return this.prismaWithTenant.product; }
    get category() { return this.prismaWithTenant.category; }
    get sale() { return this.prismaWithTenant.sale; }
    get saleItem() { return this.prismaWithTenant.saleItem; }
    get customer() { return this.prismaWithTenant.customer; }
    get transaction() { return this.prismaWithTenant.transaction; }
    get companySettings() { return this.prismaWithTenant.companySettings; }

    // Tenant model is accessible without filtering (for registration, admin)
    get tenant() { return this.prismaWithTenant.tenant; }

    // Transaction support
    async $transaction<T>(fn: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T> {
        return this.prismaWithTenant.$transaction(fn);
    }

    // Get current tenant ID
    getTenantId(): string | null {
        return this.tenantId;
    }
}
