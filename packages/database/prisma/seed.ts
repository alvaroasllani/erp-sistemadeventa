import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting multi-tenant seed...");

    // 1. Create demo tenant
    const tenant = await prisma.tenant.upsert({
        where: { slug: "ferreteria-express" },
        update: {},
        create: {
            name: "Ferretería Express",
            slug: "ferreteria-express",
            plan: "PRO",
            isActive: true,
        },
    });
    console.log(`✅ Tenant created: ${tenant.name}`);

    // 2. Create admin user for this tenant
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const user = await prisma.user.upsert({
        where: { email: "admin@nexus.com" },
        update: { tenantId: tenant.id },
        create: {
            email: "admin@nexus.com",
            password: hashedPassword,
            name: "Juan Díaz",
            role: "ADMIN",
            tenantId: tenant.id,
        },
    });
    console.log(`✅ Admin user created: ${user.email}`);

    // 3. Create company settings for tenant
    await prisma.companySettings.upsert({
        where: { tenantId: tenant.id },
        update: {},
        create: {
            tenantId: tenant.id,
            name: "Ferretería Express",
            address: "Calle Principal #123, Santo Domingo",
            phone: "(809) 555-0100",
            email: "contacto@ferreteriaexpress.com",
            taxRate: 0.18,
            currency: "DOP",
        },
    });
    console.log("✅ Company settings created");

    // 4. Create categories for tenant
    const categories = [
        { name: "Herramientas", color: "#3B82F6" },
        { name: "Pinturas", color: "#8B5CF6" },
        { name: "Plomería", color: "#06B6D4" },
        { name: "Electricidad", color: "#F59E0B" },
        { name: "Seguridad", color: "#EF4444" },
        { name: "Construcción", color: "#6B7280" },
        { name: "Jardinería", color: "#22C55E" },
        { name: "Ferretería General", color: "#EC4899" },
    ];

    const categoryMap = new Map<string, string>();
    for (const cat of categories) {
        const category = await prisma.category.upsert({
            where: {
                tenantId_name: { tenantId: tenant.id, name: cat.name }
            },
            update: {},
            create: {
                tenantId: tenant.id,
                name: cat.name,
                color: cat.color,
            },
        });
        categoryMap.set(cat.name, category.id);
    }
    console.log(`✅ ${categories.length} categories created`);

    // 5. Create sample products for tenant
    const products = [
        { sku: "FER-001", name: "Martillo Profesional Stanley", category: "Herramientas", costPrice: 120, salePrice: 189, stock: 45, minStock: 5 },
        { sku: "FER-002", name: "Destornillador Phillips #2", category: "Herramientas", costPrice: 35, salePrice: 55, stock: 3, minStock: 10 },
        { sku: "FER-003", name: "Cinta Métrica 5m Stanley", category: "Herramientas", costPrice: 45, salePrice: 75, stock: 28, minStock: 8 },
        { sku: "PIN-001", name: "Pintura Blanca Mate 4L", category: "Pinturas", costPrice: 180, salePrice: 280, stock: 15, minStock: 5 },
        { sku: "FER-004", name: "Cerradura Phillips 500", category: "Seguridad", costPrice: 320, salePrice: 489, stock: 8, minStock: 3 },
        { sku: "PLO-001", name: 'Tubo PVC 4" x 6m', category: "Plomería", costPrice: 85, salePrice: 129, stock: 32, minStock: 10 },
        { sku: "ELE-001", name: "Cable 12 AWG Rojo (100m)", category: "Electricidad", costPrice: 580, salePrice: 890, stock: 12, minStock: 5 },
        { sku: "PIN-002", name: 'Brocha Premium 4"', category: "Pinturas", costPrice: 28, salePrice: 45, stock: 56, minStock: 15 },
        { sku: "FER-005", name: 'Llave Inglesa Ajustable 12"', category: "Herramientas", costPrice: 95, salePrice: 149, stock: 18, minStock: 5 },
        { sku: "FER-006", name: "Silicón Transparente 280ml", category: "Ferretería General", costPrice: 42, salePrice: 68, stock: 65, minStock: 20 },
        { sku: "FER-007", name: "Tornillos Galvanizados (100pz)", category: "Ferretería General", costPrice: 28, salePrice: 45, stock: 120, minStock: 30 },
        { sku: "FER-008", name: 'Clavos 2" (1kg)', category: "Construcción", costPrice: 22, salePrice: 35, stock: 85, minStock: 25 },
        { sku: "CON-001", name: "Cemento Gris 50kg", category: "Construcción", costPrice: 180, salePrice: 245, stock: 48, minStock: 20 },
        { sku: "JAR-001", name: "Manguera 15m Reforzada", category: "Jardinería", costPrice: 120, salePrice: 189, stock: 0, minStock: 5 },
        { sku: "FER-009", name: "Taladro Percutor 750W", category: "Herramientas", costPrice: 850, salePrice: 1250, stock: 4, minStock: 2 },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: {
                tenantId_sku: { tenantId: tenant.id, sku: product.sku }
            },
            update: {},
            create: {
                tenantId: tenant.id,
                sku: product.sku,
                name: product.name,
                categoryId: categoryMap.get(product.category),
                costPrice: product.costPrice,
                salePrice: product.salePrice,
                stock: product.stock,
                minStock: product.minStock,
            },
        });
    }
    console.log(`✅ ${products.length} products created`);

    console.log("\n🎉 Seed completed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📧 Login: admin@nexus.com`);
    console.log(`🔑 Password: admin123`);
    console.log(`🏢 Tenant: ${tenant.name}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
    .catch((e) => {
        console.error(e);
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


