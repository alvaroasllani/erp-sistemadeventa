import { create } from "zustand";
import { authApi, setAccessToken, getAccessToken, ApiError } from "@/lib/api-client";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
    tenantId: string;
}

interface Tenant {
    id: string;
    name: string;
    slug: string;
    plan: string;
}

interface AuthState {
    user: User | null;
    tenant: Tenant | null;
    isAuthenticated: boolean;
    isLoading: boolean; // For login action only
    isCheckingAuth: boolean; // For initial token check
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    tenant: null,
    isAuthenticated: false,
    isLoading: false, // Start false - only true during login
    isCheckingAuth: true, // Start true to check existing token
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authApi.login(email, password);
            set({
                user: {
                    id: response.user.id,
                    name: response.user.name,
                    email: response.user.email,
                    role: response.user.role,
                    avatar: null,
                    tenantId: response.user.tenantId,
                },
                tenant: response.tenant,
                isAuthenticated: true,
                isLoading: false,
            });
            return true;
        } catch (error) {
            const message = error instanceof ApiError
                ? error.message
                : "Error al iniciar sesión";
            set({ error: message, isLoading: false });
            return false;
        }
    },

    logout: () => {
        authApi.logout();
        set({
            user: null,
            tenant: null,
            isAuthenticated: false,
            isLoading: false,
            isCheckingAuth: false,
            error: null,
        });
    },

    checkAuth: async () => {
        const token = getAccessToken();
        if (!token) {
            set({ isCheckingAuth: false, isAuthenticated: false });
            return;
        }

        try {
            const profile = await authApi.getProfile();
            set({
                user: {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    role: profile.role,
                    avatar: profile.avatar,
                    tenantId: profile.tenantId,
                },
                tenant: profile.tenant,
                isAuthenticated: true,
                isCheckingAuth: false,
            });
        } catch {
            // Token invalid, clear it
            setAccessToken(null);
            set({ isCheckingAuth: false, isAuthenticated: false });
        }
    },

    clearError: () => set({ error: null }),
}));


