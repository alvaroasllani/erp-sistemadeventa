import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    Param,
    UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../../shared/tenant";

@ApiTags("categories")
@Controller("categories")
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    @ApiOperation({ summary: "Obtener todas las categorías" })
    findAll() {
        return this.categoriesService.findAll();
    }

    @Post()
    @ApiOperation({ summary: "Crear nueva categoría" })
    create(@Body() body: { name: string; color?: string }) {
        return this.categoriesService.create(body);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Eliminar categoría" })
    remove(@Param("id") id: string) {
        return this.categoriesService.remove(id);
    }
}
