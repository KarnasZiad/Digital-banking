export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    token: string;
    type: string;
    username: string;
    roles: string[];
}

export interface AuthenticationState {
    isAuthenticated: boolean;
    username?: string;
    roles?: string[];
    token?: string;
}
