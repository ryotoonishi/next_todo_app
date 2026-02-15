"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

/**
 * グローバル状態管理のデモコンポーネント
 * Zustand で管理されている状態の表示と操作の例
 */
export default function StoreDemo() {
  const { user, setUser, settings, updateSettings, isAuthenticated, logout } =
    useAppStore();

  const handleLogin = () => {
    setUser({
      id: "user123",
      name: "太郎",
      email: "taro@example.com",
    });
  };

  const handleToggleTheme = () => {
    updateSettings({
      theme: settings.theme === "light" ? "dark" : "light",
    });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Zustand グローバル状態管理デモ
          </Typography>

          {/* ユーザー情報表示 */}
          <Box sx={{ my: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              ユーザー情報
            </Typography>
            {isAuthenticated && user ? (
              <Stack spacing={1}>
                <Typography>ID: {user.id}</Typography>
                <Typography>名前: {user.name}</Typography>
                <Typography>メール: {user.email}</Typography>
              </Stack>
            ) : (
              <Typography color="error">ログインしていません</Typography>
            )}
          </Box>

          {/* アプリ設定表示 */}
          <Box sx={{ my: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              アプリ設定
            </Typography>
            <Stack spacing={1}>
              <Typography>テーマ: {settings.theme}</Typography>
              <Typography>言語: {settings.language}</Typography>
            </Stack>
          </Box>

          {/* 操作ボタン */}
          <Stack direction="row" spacing={2}>
            {!isAuthenticated ? (
              <Button variant="contained" onClick={handleLogin}>
                ログイン
              </Button>
            ) : (
              <Button variant="contained" color="error" onClick={logout}>
                ログアウト
              </Button>
            )}
            <Button variant="outlined" onClick={handleToggleTheme}>
              テーマ切り替え
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
