import React from "react";
import { Box, Typography } from "@mui/material";

export default function PrepareCountdown({ secondsLeft }: { secondsLeft: number }) {
  return (
    <Box>
      <Typography
        variant="h2"
        fontWeight={900}
        sx={{
          color: "#FFB300",
          animation: "pulse 1s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 1, transform: "scale(1)" },
            "50%": { opacity: 0.7, transform: "scale(1.08)" },
          },
        }}
      >
        {secondsLeft}
      </Typography>
      <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#FFB300", mt: 0.5 }}>
        GET READY
      </Typography>
    </Box>
  );
}
