// グローバル状態の型定義
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AppSettings {
    theme: 'light' | 'dark';
    language: 'ja' | 'en';
}

export interface AppState {
    // ユーザー情報
    user: User | null;
    setUser: (user: User | null) => void;

    // アプリ設定
    settings: AppSettings;
    updateSettings: (settings: Partial<AppSettings>) => void;

    // 認証状態
    isAuthenticated: boolean;
    setIsAuthenticated: (authenticated: boolean) => void;

    // ログアウト
    logout: () => void;
}
