import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../../shared/prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        plan: true,
                        isActive: true,
                    },
                },
            },
        });

        if (!user) {
            throw new UnauthorizedException("Credenciales inválidas");
        }

        // Verify tenant is active
        if (!user.tenant?.isActive) {
            throw new UnauthorizedException("Tu organización está desactivada. Contacta al administrador.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Credenciales inválidas");
        }

        return user;
    }

    async login(user: {
        id: string;
        email: string;
        name: string;
        role: string;
        tenantId: string;
        tenant?: { id: string; name: string; slug: string; plan: string };
    }) {
        // Include tenantId in JWT payload for multi-tenant isolation
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
        };

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                tenantId: user.tenantId,
            },
            tenant: user.tenant ? {
                id: user.tenant.id,
                name: user.tenant.name,
                slug: user.tenant.slug,
                plan: user.tenant.plan,
            } : null,
            accessToken: this.jwtService.sign(payload),
        };
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                tenantId: true,
                createdAt: true,
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        plan: true,
                    },
                },
            },
        });

        if (!user) {
            throw new UnauthorizedException("Usuario no encontrado");
        }

        return user;
    }
}

