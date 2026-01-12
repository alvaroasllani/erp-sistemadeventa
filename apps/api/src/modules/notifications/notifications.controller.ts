import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../../shared/tenant";
import { NotificationsService } from "./notifications.service";

@ApiTags("notifications")
@Controller("notifications")
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    @ApiOperation({ summary: "Obtener notificaciones del sistema (stock bajo, ventas recientes, etc.)" })
    getNotifications() {
        return this.notificationsService.getNotifications();
    }
}
