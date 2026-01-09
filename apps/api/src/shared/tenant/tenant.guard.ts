import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";

/**
 * TenantGuard - Validates that the authenticated user has a valid tenantId
 * 
 * This is Layer 2 of our security model - guards protected routes.
 * Apply this guard to all routes that require tenant isolation.
 */
@Injectable()
export class TenantGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException("Usuario no autenticado");
        }

        if (!user.tenantId) {
            throw new ForbiddenException("Usuario sin tenant asignado");
        }

        // Verify tenant is active (optional: could add DB check here)
        return true;
    }
}
