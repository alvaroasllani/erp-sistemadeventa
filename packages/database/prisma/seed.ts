import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // Create default company settings
    await prisma.companySettings.upsert({
        where: { id: "default" },
        update: {},
        create: {
            id: "default",
            name: "Ferretería Express",
            address: "Calle Principal #123, Santo Domingo",
            phone: "(809) 555-0100",
            email: "contacto@ferreteriaexpress.com",
            taxRate: 0.18,
            currency: "DOP",
        },
    });

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
        where: { email: "admin@nexus.com" },
        update: {},
        create: {
            email: "admin@nexus.com",
            password: hashedPassword,
            name: "Juan Díaz",
            role: "ADMIN",
        },
    });

    // Create sample products
    const products = [
        { sku: "FER-001", name: "Martillo Profesional Stanley", category: "HERRAMIENTAS" as const, costPrice: 120, salePrice: 189, stock: 45, minStock: 5 },
        { sku: "FER-002", name: "Destornillador Phillips #2", category: "HERRAMIENTAS" as const, costPrice: 35, salePrice: 55, stock: 3, minStock: 10 },
        { sku: "FER-003", name: "Cinta Métrica 5m Stanley", category: "HERRAMIENTAS" as const, costPrice: 45, salePrice: 75, stock: 28, minStock: 8 },
        { sku: "PIN-001", name: "Pintura Blanca Mate 4L", category: "PINTURAS" as const, costPrice: 180, salePrice: 280, stock: 15, minStock: 5 },
        { sku: "FER-004", name: "Cerradura Phillips 500", category: "SEGURIDAD" as const, costPrice: 320, salePrice: 489, stock: 8, minStock: 3 },
        { sku: "PLO-001", name: 'Tubo PVC 4" x 6m', category: "PLOMERIA" as const, costPrice: 85, salePrice: 129, stock: 32, minStock: 10 },
        { sku: "ELE-001", name: "Cable 12 AWG Rojo (100m)", category: "ELECTRICIDAD" as const, costPrice: 580, salePrice: 890, stock: 12, minStock: 5 },
        { sku: "PIN-002", name: 'Brocha Premium 4"', category: "PINTURAS" as const, costPrice: 28, salePrice: 45, stock: 56, minStock: 15 },
        { sku: "FER-005", name: 'Llave Inglesa Ajustable 12"', category: "HERRAMIENTAS" as const, costPrice: 95, salePrice: 149, stock: 18, minStock: 5 },
        { sku: "FER-006", name: "Silicón Transparente 280ml", category: "FERRETERIA_GENERAL" as const, costPrice: 42, salePrice: 68, stock: 65, minStock: 20 },
        { sku: "FER-007", name: "Tornillos Galvanizados (100pz)", category: "FERRETERIA_GENERAL" as const, costPrice: 28, salePrice: 45, stock: 120, minStock: 30 },
        { sku: "FER-008", name: 'Clavos 2" (1kg)', category: "CONSTRUCCION" as const, costPrice: 22, salePrice: 35, stock: 85, minStock: 25 },
        { sku: "CON-001", name: "Cemento Gris 50kg", category: "CONSTRUCCION" as const, costPrice: 180, salePrice: 245, stock: 48, minStock: 20 },
        { sku: "JAR-001", name: "Manguera 15m Reforzada", category: "JARDINERIA" as const, costPrice: 120, salePrice: 189, stock: 0, minStock: 5 },
        { sku: "FER-009", name: "Taladro Percutor 750W", category: "HERRAMIENTAS" as const, costPrice: 850, salePrice: 1250, stock: 4, minStock: 2 },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { sku: product.sku },
            update: {},
            create: product,
        });
    }

    console.log("✅ Seed completed!");
    console.log(`   - 1 company settings`);
    console.log(`   - 1 admin user (admin@nexus.com / admin123)`);
    console.log(`   - ${products.length} products`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
