import { Injectable, NotFoundException } from "@nestjs/common";
import { TenantPrismaService } from "../../shared/tenant";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import { Prisma } from "@prisma/client";

/**
 * ProductsService - Tenant-aware product management
 * 
 * Uses TenantPrismaService which automatically filters all queries by tenantId.
 * No manual tenant filtering needed - the service handles it automatically.
 */
@Injectable()
export class ProductsService {
    constructor(private prisma: TenantPrismaService) { }

    async findAll(params?: {
        skip?: number;
        take?: number;
        search?: string;
        categoryId?: string;
        stockStatus?: string;
    }) {
        const { skip = 0, take = 20, search, categoryId, stockStatus } = params || {};

        const where: Prisma.ProductWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
            ];
        }

        if (categoryId && categoryId !== "all") {
            where.categoryId = categoryId;
        }

        if (stockStatus === "low") {
            where.stock = { lt: 5 };
        } else if (stockStatus === "out") {
            where.stock = 0;
        }

        // TenantPrismaService auto-adds tenantId filter
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: {
                    category: {
                        select: { id: true, name: true, color: true },
                    },
                },
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            data: products,
            meta: {
                total,
                page: Math.floor(skip / take) + 1,
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        };
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: {
                    select: { id: true, name: true, color: true },
                },
            },
        });

        if (!product) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }

        return product;
    }

    async create(data: CreateProductDto) {
        // TenantPrismaService auto-adds tenantId via extension
        return this.prisma.product.create({
            data: data as any, // Type assertion needed due to Prisma extension
            include: {
                category: {
                    select: { id: true, name: true, color: true },
                },
            },
        });
    }

    async update(id: string, data: UpdateProductDto) {
        await this.findOne(id); // Check if exists (and belongs to tenant)
        return this.prisma.product.update({
            where: { id },
            data,
            include: {
                category: {
                    select: { id: true, name: true, color: true },
                },
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id); // Check if exists (and belongs to tenant)
        return this.prisma.product.delete({
            where: { id },
        });
    }

    async getLowStock(threshold = 5) {
        return this.prisma.product.findMany({
            where: {
                stock: { lt: threshold },
                status: "ACTIVE",
            },
            orderBy: { stock: "asc" },
            include: {
                category: {
                    select: { id: true, name: true, color: true },
                },
            },
        });
    }

    async updateStock(id: string, quantity: number) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: {
                stock: { increment: quantity },
            },
        });
    }
}

