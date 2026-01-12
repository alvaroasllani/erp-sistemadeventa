import { Module } from "@nestjs/common";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { TenantModule } from "../../shared/tenant";

@Module({
    imports: [TenantModule],
    controllers: [NotificationsController],
    providers: [NotificationsService],
})
export class NotificationsModule { }
