import React from "react";
import { Button, Stack } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";

interface TimerControlsProps {
  isPreparing: boolean;
  isActive: boolean;
  phase: string;
  onStart: () => void;
  onReset: () => void;
}

export default function TimerControls({
  isPreparing,
  isActive,
  phase,
  onStart,
  onReset,
}: TimerControlsProps) {
  const startLabel = isPreparing
    ? "Cancel"
    : isActive
      ? "Pause"
      : phase === "done"
        ? "Restart"
        : "Start";

  return (
    <Stack direction="row" spacing={1.5}>
      <Button
        variant="contained"
        startIcon={isPreparing || isActive ? <PauseIcon /> : <PlayArrowIcon />}
        onClick={onStart}
        color={isPreparing ? "warning" : "primary"}
      >
        {startLabel}
      </Button>
      <Button variant="outlined" startIcon={<ReplayIcon />} onClick={onReset}>
        Reset
      </Button>
    </Stack>
  );
}
