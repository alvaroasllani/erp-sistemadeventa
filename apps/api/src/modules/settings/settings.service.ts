import { Injectable } from "@nestjs/common";
import { TenantPrismaService } from "../../shared/tenant";

@Injectable()
export class SettingsService {
    constructor(private prisma: TenantPrismaService) { }

    async getCompanySettings() {
        // TenantPrismaService auto-filters by tenant
        let settings = await this.prisma.companySettings.findFirst({});
        if (!settings) {
            // Create default settings for this tenant
            settings = await this.prisma.companySettings.create({
                data: {} as any, // tenantId is auto-injected
            });
        }
        return settings;
    }

    async updateCompanySettings(data: {
        name?: string;
        rnc?: string;
        address?: string;
        phone?: string;
        email?: string;
        logo?: string;
        taxRate?: number;
        currency?: string;
    }) {
        const existing = await this.prisma.companySettings.findFirst({});
        if (existing) {
            return this.prisma.companySettings.update({
                where: { id: existing.id },
                data: data as any,
            });
        }
        return this.prisma.companySettings.create({
            data: data as any,
        });
    }
}

