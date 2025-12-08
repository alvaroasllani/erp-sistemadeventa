import { create } from "zustand";
import { COMPANY_INFO } from "@/lib/constants";

interface User {
    name: string;
    email: string;
    role: string;
    avatar: string | null;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;

    // Actions
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    // Initialize with mock user for demo purposes
    user: COMPANY_INFO.user,
    isAuthenticated: true,

    login: (user: User) => {
        set({ user, isAuthenticated: true });
    },

    logout: () => {
        set({ user: null, isAuthenticated: false });
    },
}));
