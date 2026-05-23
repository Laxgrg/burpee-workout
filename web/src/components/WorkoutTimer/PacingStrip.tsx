import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

interface PacingStripProps {
  goFlash: boolean;
  secondsToNextRep: number | null;
  intervalSecs: number;
  restProgress: number;
  size?: "normal" | "compact";
}

export default function PacingStrip({
  goFlash,
  secondsToNextRep,
  intervalSecs,
  restProgress,
  size = "normal",
}: PacingStripProps) {
  const barColor =
    restProgress > 50 ? "#4caf50" : restProgress > 20 ? "#FFB300" : "#FF3366";

  return (
    <Box sx={{ mt: 0.75 }}>
      {goFlash ? (
        <Typography
          variant={size === "normal" ? "h5" : "body1"}
          fontWeight={900}
          sx={{
            color: "primary.main",
            animation: "pacingGoFlash 0.4s ease-out",
            "@keyframes pacingGoFlash": {
              "0%": { opacity: 0.3, transform: "scale(0.7)" },
              "60%": { opacity: 1, transform: "scale(1.2)" },
              "100%": { opacity: 1, transform: "scale(1)" },
            },
          }}
        >
          GO!
        </Typography>
      ) : (
        secondsToNextRep !== null && (
          <Typography
            variant="body2"
            fontWeight={700}
            color={secondsToNextRep <= 3 ? "warning.main" : "text.secondary"}
          >
            {secondsToNextRep <= 3
              ? `GET READY — ${secondsToNextRep}s`
              : `REST — ${secondsToNextRep}s`}
          </Typography>
        )
      )}

      {intervalSecs > 0 && secondsToNextRep !== null && (
        <Box sx={{ mt: 0.75, px: 1 }}>
          <LinearProgress
            variant="determinate"
            value={restProgress}
            sx={{
              height: size === "normal" ? 7 : 6,
              borderRadius: 4,
              backgroundColor: "rgba(255,255,255,0.08)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                backgroundColor: barColor,
                transition: "width 0.9s linear, background-color 0.3s ease",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
