import { Controller, Get, Patch, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { SettingsService } from "./settings.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../../shared/tenant";

@ApiTags("settings")
@Controller("settings")
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get("company")
    @ApiOperation({ summary: "Obtener configuración de la empresa" })
    getCompanySettings() {
        return this.settingsService.getCompanySettings();
    }

    @Patch("company")
    @ApiOperation({ summary: "Actualizar configuración de la empresa" })
    updateCompanySettings(@Body() data: {
        name?: string;
        rnc?: string;
        address?: string;
        phone?: string;
        email?: string;
        logo?: string;
        taxRate?: number;
        currency?: string;
    }) {
        return this.settingsService.updateCompanySettings(data);
    }
}
