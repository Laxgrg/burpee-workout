import React from "react";
import { Box, Button, Typography } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

export default function CooldownBanner({ onShowCooldown }: { onShowCooldown?: () => void }) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "success.main",
        borderRadius: 2,
        p: 1.5,
        textAlign: "center",
        width: "100%",
      }}
    >
      <Typography variant="subtitle2" fontWeight={700} color="success.main" mb={1}>
        Great job. Cool down for 5–10 min. 🎉
      </Typography>
      <Button
        variant="outlined"
        color="success"
        size="small"
        startIcon={<FitnessCenterIcon />}
        onClick={onShowCooldown}
      >
        Show Cool-down
      </Button>
    </Box>
  );
}
