interface UserLocal {
    user: Record<string, unknown> | null;
    userId: string | null;
    refreshToken: string;
}

export const getUserLocal = (): UserLocal => {
    const user = () => {
        const stored = localStorage.getItem('sb-hpnokwlodebafzgebopj-auth-token') ?? undefined;
        return stored ? JSON.parse(stored) : null;
    };

    const refreshToken = user()?.refresh_token ?? null;
    const userId = user()?.user?.id ?? null;

    return {
        user: user(),
        userId,
        refreshToken
    }
};