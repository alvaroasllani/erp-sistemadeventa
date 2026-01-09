import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * CurrentTenant - Decorator to extract tenantId from the authenticated user
 * 
 * Usage in controllers:
 * @Get()
 * findAll(@CurrentTenant() tenantId: string) { ... }
 */
export const CurrentTenant = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return request.user?.tenantId;
    }
);

/**
 * CurrentUser - Decorator to extract the full user object from request
 * 
 * Usage in controllers:
 * @Get()
 * getProfile(@CurrentUser() user: UserPayload) { ... }
 */
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
);

/**
 * Type for the user payload stored in JWT
 */
export interface JwtPayload {
    sub: string;        // User ID
    email: string;
    role: string;
    tenantId: string;
    iat?: number;
    exp?: number;
}
