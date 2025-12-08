import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma/prisma.service";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async findAll(params?: {
        skip?: number;
        take?: number;
        search?: string;
        category?: string;
        stockStatus?: string;
    }) {
        const { skip = 0, take = 20, search, category, stockStatus } = params || {};

        const where: Prisma.ProductWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
            ];
        }

        if (category && category !== "all") {
            where.category = category as Prisma.EnumProductCategoryFilter;
        }

        if (stockStatus === "low") {
            where.stock = { lt: 5 };
        } else if (stockStatus === "out") {
            where.stock = 0;
        }

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
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
        });

        if (!product) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }

        return product;
    }

    async create(data: CreateProductDto) {
        return this.prisma.product.create({
            data,
        });
    }

    async update(id: string, data: UpdateProductDto) {
        await this.findOne(id); // Check if exists
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        await this.findOne(id); // Check if exists
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
