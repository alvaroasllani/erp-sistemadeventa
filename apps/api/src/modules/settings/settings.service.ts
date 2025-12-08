import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma/prisma.service";

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    async getCompanySettings() {
        let settings = await this.prisma.companySettings.findFirst();
        if (!settings) {
            settings = await this.prisma.companySettings.create({
                data: { id: "default" },
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
        return this.prisma.companySettings.upsert({
            where: { id: "default" },
            update: data,
            create: { id: "default", ...data },
        });
    }
}
