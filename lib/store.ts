import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, AppSettings } from '@/types/store';

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // ユーザー情報の初期値
            user: null,
            setUser: (user) => set({ user, isAuthenticated: user !== null }),

            // アプリ設定の初期値
            settings: {
                theme: 'light',
                language: 'ja',
            },
            updateSettings: (newSettings) =>
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                })),

            // 認証状態の初期値
            isAuthenticated: false,
            setIsAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),


            // ログアウト処理
            logout: () =>
                set({
                    user: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: 'app-store', // LocalStorage に保存されるキー名
        }
    )
);
