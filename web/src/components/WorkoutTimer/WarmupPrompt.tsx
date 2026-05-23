import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

interface WarmupPromptProps {
  onConfirm: () => void;
  onShowWarmup: () => void;
}

export default function WarmupPrompt({ onConfirm, onShowWarmup }: WarmupPromptProps) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "warning.main",
        borderRadius: 2,
        p: 2,
        textAlign: "center",
        width: "100%",
      }}
    >
      <Typography variant="subtitle2" fontWeight={700} color="warning.main" mb={1.5}>
        Did you warm up?
      </Typography>
      <Stack spacing={1}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<PlayArrowIcon />}
          onClick={onConfirm}
        >
          Yes, Start Workout
        </Button>
        <Button
          variant="outlined"
          color="warning"
          size="small"
          startIcon={<FitnessCenterIcon />}
          onClick={onShowWarmup}
        >
          Show Warm-up
        </Button>
      </Stack>
    </Box>
  );
}
