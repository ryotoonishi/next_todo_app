"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

export default function CounterPage() {
  const router = useRouter();
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%" }}>
        <CardContent>
          <Box sx={{ textAlign: "center", gap: 3, display: "flex", flexDirection: "column" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              カウンター
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 200,
                backgroundColor: "#e3f2fd",
                borderRadius: 2,
              }}
            >
              <Typography variant="h1" sx={{ color: "#1976d2" }}>
                {count}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="error"
                onClick={decrement}
                sx={{ minWidth: 100 }}
              >
                -1
              </Button>
              <Button
                variant="outlined"
                onClick={reset}
                sx={{ minWidth: 100 }}
              >
                リセット
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={increment}
                sx={{ minWidth: 100 }}
              >
                +1
              </Button>
            </Stack>

            <Button
              variant="text"
              onClick={() => router.push("/")}
            >
              ホームに戻る
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
