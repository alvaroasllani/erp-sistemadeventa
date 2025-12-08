import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma/prisma.service";
import { ProductsService } from "../products/products.service";
import { CreateSaleDto } from "./dto/sale.dto";

@Injectable()
export class SalesService {
    constructor(
        private prisma: PrismaService,
        private productsService: ProductsService
    ) { }

    async create(data: CreateSaleDto, userId?: string) {
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

        // Get tax rate from settings
        const settings = await this.prisma.companySettings.findFirst();
        const taxRate = settings?.taxRate?.toNumber() || 0.18;

        // Calculate totals
        const subtotal = itemsWithProducts.reduce(
            (sum, item) => sum + item.product.salePrice.toNumber() * item.quantity,
            0
        );
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        // Create sale with items in transaction
        const sale = await this.prisma.$transaction(async (tx) => {
            // Create sale
            const newSale = await tx.sale.create({
                data: {
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

            // Update stock for each product
            for (const item of itemsWithProducts) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // Create transaction record
            await tx.transaction.create({
                data: {
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

        const [sales, total] = await Promise.all([
            this.prisma.sale.findMany({
                where,
                skip,
                take,
                include: { items: true, user: { select: { name: true } } },
                orderBy: { createdAt: "desc" },
            }),
            this.prisma.sale.count({ where }),
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
        return this.prisma.sale.findUnique({
            where: { id },
            include: { items: true, user: { select: { name: true } }, customer: true },
        });
    }

    async getTodayStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [todaySales, todayOrders] = await Promise.all([
            this.prisma.sale.aggregate({
                where: { createdAt: { gte: today }, status: "COMPLETED" },
                _sum: { total: true },
            }),
            this.prisma.sale.count({
                where: { createdAt: { gte: today }, status: "COMPLETED" },
            }),
        ]);

        return {
            todaySales: todaySales._sum.total?.toNumber() || 0,
            todayOrders,
        };
    }
}
