import { Injectable, BadRequestException, ForbiddenException } from "@nestjs/common";
import { TenantPrismaService } from "../../shared/tenant";
import { PrismaService } from "../../shared/prisma/prisma.service";
import { ProductsService } from "../products/products.service";
import { CreateSaleDto } from "./dto/sale.dto";

@Injectable()
export class SalesService {
    constructor(
        private tenantPrisma: TenantPrismaService,
        private prisma: PrismaService, // For $transaction support
        private productsService: ProductsService
    ) { }

    async create(data: CreateSaleDto, userId?: string) {
        // Get tenantId for manual injection in transaction
        const tenantId = this.tenantPrisma.getTenantId();
        if (!tenantId) {
            throw new ForbiddenException("Tenant no identificado");
        }

        // Get products and calculate totals
        const itemsWithProducts = await Promise.all(
            data.items.map(async (item) => {
                const product = await this.productsService.findOne(item.productId);
                if (product.stock < item.quantity) {
                    throw new BadRequestException(
                        `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
                    );
                }
                return {
                    ...item,
                    product,
                };
            })
        );

        // Get tax rate from settings (tenant-filtered)
        const settings = await this.tenantPrisma.companySettings.findFirst({});
        const taxRate = settings?.taxRate?.toNumber() || 0.18;

        // Calculate totals
        const subtotal = itemsWithProducts.reduce(
            (sum, item) => sum + item.product.salePrice.toNumber() * item.quantity,
            0
        );
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        // Create sale with items in transaction (with manual tenantId injection)
        const sale = await this.prisma.$transaction(async (tx) => {
            // Create sale with tenantId
            const newSale = await tx.sale.create({
                data: {
                    tenantId, // Manual injection
                    subtotal,
                    tax,
                    total,
                    paymentMethod: data.paymentMethod.toUpperCase() as "CASH" | "CARD" | "QR",
                    userId,
                    customerId: data.customerId,
                    items: {
                        create: itemsWithProducts.map((item) => ({
                            productId: item.productId,
                            productName: item.product.name,
                            productSku: item.product.sku,
                            quantity: item.quantity,
                            unitPrice: item.product.salePrice,
                            total: item.product.salePrice.toNumber() * item.quantity,
                        })),
                    },
                },
                include: { items: true },
            });

            // Update stock for each product (verify tenant ownership)
            for (const item of itemsWithProducts) {
                await tx.product.update({
                    where: { id: item.productId, tenantId }, // Verify tenant
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // Create transaction record with tenantId
            await tx.transaction.create({
                data: {
                    tenantId, // Manual injection
                    type: "SALE",
                    description: `Venta #${newSale.id.slice(-6).toUpperCase()}`,
                    amount: total,
                    method: newSale.paymentMethod,
                    reference: newSale.id,
                },
            });

            return newSale;
        });

        return sale;
    }

    async findAll(params?: { skip?: number; take?: number; startDate?: Date; endDate?: Date }) {
        const { skip = 0, take = 20, startDate, endDate } = params || {};

        const where: { createdAt?: { gte?: Date; lte?: Date } } = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = startDate;
            if (endDate) where.createdAt.lte = endDate;
        }

        // TenantPrismaService auto-filters by tenant
        const [sales, total] = await Promise.all([
            this.tenantPrisma.sale.findMany({
                where,
                skip,
                take,
                include: { items: true, user: { select: { name: true } } },
                orderBy: { createdAt: "desc" },
            }),
            this.tenantPrisma.sale.count({ where }),
        ]);

        return {
            data: sales,
            meta: {
                total,
                page: Math.floor(skip / take) + 1,
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        };
    }

    async findOne(id: string) {
        return this.tenantPrisma.sale.findUnique({
            where: { id },
            include: { items: true, user: { select: { name: true } }, customer: true },
        });
    }

    async getTodayStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Use tenantPrisma for auto-filtered stats
        const [todaySales, todayOrders] = await Promise.all([
            this.tenantPrisma.sale.aggregate({
                where: { createdAt: { gte: today }, status: "COMPLETED" },
                _sum: { total: true },
            }),
            this.tenantPrisma.sale.count({
                where: { createdAt: { gte: today }, status: "COMPLETED" },
            }),
        ]);

        return {
            todaySales: todaySales._sum.total?.toNumber() || 0,
            todayOrders,
        };
    }

    async cancel(id: string, createRefund: boolean = true) {
        const tenantId = this.tenantPrisma.getTenantId();
        if (!tenantId) throw new ForbiddenException("Tenant no identificado");

        const sale = await this.tenantPrisma.sale.findUnique({
            where: { id },
            include: { items: true },
        });

        if (!sale) throw new BadRequestException("Venta no encontrada");
        if (sale.status === "CANCELLED") throw new BadRequestException("La venta ya está cancelada");

        return this.prisma.$transaction(async (tx) => {
            // 1. Update Sale Status
            const updatedSale = await tx.sale.update({
                where: { id },
                data: { status: "CANCELLED" },
            });

            // 2. Restore Stock
            for (const item of sale.items) {
                await tx.product.update({
                    where: { id: item.productId, tenantId }, // Ensure tenant isolation
                    data: { stock: { increment: item.quantity } },
                });
            }

            // 3. Create Refund Transaction (Optional)
            if (createRefund) {
                await tx.transaction.create({
                    data: {
                        tenantId,
                        type: "REFUND",
                        description: `Anulación Venta #${sale.id.slice(-6).toUpperCase()}`,
                        amount: sale.total, // Positive amount, but type REFUND implies outflow in logic
                        method: sale.paymentMethod,
                        reference: sale.id,
                    },
                });
            }

            return updatedSale;
        });
    }
}

