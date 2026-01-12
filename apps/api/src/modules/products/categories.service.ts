import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { TenantPrismaService } from "../../shared/tenant";
import { Prisma } from "@prisma/client";

@Injectable()
export class CategoriesService {
    constructor(private prisma: TenantPrismaService) { }

    async findAll() {
        // TenantPrismaService auto-adds tenantId filter
        return this.prisma.category.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
    }

    async create(data: { name: string; color?: string }) {
        try {
            return await this.prisma.category.create({
                data: {
                    name: data.name,
                    color: data.color || "#6366f1",
                } as any,
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new BadRequestException(`La categoría "${data.name}" ya existe.`);
            }
            throw error;
        }
    }

    async remove(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });

        if (!category) {
            throw new NotFoundException("Categoría no encontrada");
        }

        if (category._count.products > 0) {
            throw new BadRequestException("No se puede eliminar una categoría que tiene productos asociados.");
        }

        return this.prisma.category.delete({
            where: { id },
        });
    }
}
