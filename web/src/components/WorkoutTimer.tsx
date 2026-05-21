"use client";

import React, { useMemo } from "react";
import { Box, Button, Card, Chip, Stack, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import VideocamIcon from "@mui/icons-material/Videocam";
import {
  buildWorkoutTimerConfig,
  formatWorkoutTimerTime,
  WorkoutMode,
} from "../../../shared/workoutTimer";
import { useWorkoutTimer } from "../hooks/useWorkoutTimer";
import { WorkoutTier } from "../types";

interface WorkoutTimerProps {
  tier: WorkoutTier;
  sealsGoal?: number;
  sixCountsGoal?: number;
  /** Preset the active mode tab (e.g. "H" on Fridays for advanced track) */
  defaultMode?: WorkoutMode;
  onFinish?: (repsCompleted: number, mode: string) => void;
  onOpenVideo?: () => void;
}

export default function WorkoutTimer({
  tier,
  sealsGoal = 0,
  sixCountsGoal = 0,
  defaultMode,
  onFinish,
  onOpenVideo,
}: WorkoutTimerProps) {
  const timerConfig = useMemo(
    () =>
      buildWorkoutTimerConfig({
        tier,
        sealsGoal,
        sixCountsGoal,
        defaultMode,
      }),
    [sealsGoal, sixCountsGoal, tier, defaultMode],
  );

  const {
    activeMode,
    modes,
    secondsLeft,
    isActive,
    currentRep,
    secondsToNextRep,
    phase,
    prepareSecondsLeft,
    hybridState,
    toggleTimer,
    resetTimer,
    selectMode,
  } = useWorkoutTimer({
    config: timerConfig,
    onFinish,
  });

  const isBeginnerTrack = tier === "beginner";
  const isPreparing = phase === "prepare";
  const isHybridMode = activeMode.mode === "H";

  return (
    <Card
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 2,
      }}
    >
      <TimerOutlinedIcon color="secondary" sx={{ fontSize: 42 }} />
      <Typography variant="h6" fontWeight={800}>
        Session Timer
      </Typography>

      {modes.length > 1 ? (
        <Stack direction="row" spacing={1}>
          {modes.map((entry) => (
            <Chip
              key={entry.mode}
              label={entry.label}
              color={activeMode.mode === entry.mode ? "primary" : "default"}
              onClick={() => selectMode(entry.mode)}
              sx={{ fontWeight: 700 }}
            />
          ))}
        </Stack>
      ) : (
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {activeMode.label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeMode.description}
          </Typography>
        </Box>
      )}

      {/* ── Prepare countdown overlay ────────────────────────────── */}
      {isPreparing ? (
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
            {prepareSecondsLeft}
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ color: "#FFB300", mt: 0.5 }}
          >
            GET READY
          </Typography>
        </Box>
      ) : isHybridMode && hybridState ? (
        // ── Hybrid mode display ──────────────────────────────────────────
        <Box textAlign="center">
          {/* Phase label */}
          <Typography variant="subtitle2" color="text.secondary" fontWeight={700} mb={0.5}>
            Phase {hybridState.phaseIndex + 1} of {hybridState.totalPhases}:{" "}
            {hybridState.phase.label}
          </Typography>

          {/* Phase countdown (resets to 10:00 for each phase) */}
          <Typography variant="h2" fontWeight={900} color="primary.main">
            {formatWorkoutTimerTime(hybridState.phaseSecondsLeft)}
          </Typography>

          {/* Total workout time remaining */}
          <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 0.25 }}>
            Total: {formatWorkoutTimerTime(secondsLeft)} remaining
          </Typography>

          {/* Rep counter for the current phase */}
          {hybridState.phase.goal > 0 && (
            <Box mt={0.5}>
              <Typography variant="subtitle2" color="secondary.main" fontWeight={800}>
                REP {currentRep} / {hybridState.phase.goal}
              </Typography>
              {isActive && hybridState.phaseSecondsToNextRep !== null && (
                <Typography variant="body2" color="text.secondary">
                  Next in {hybridState.phaseSecondsToNextRep}s
                </Typography>
              )}
            </Box>
          )}
        </Box>
      ) : (
        // ── Standard single-phase display ────────────────────────────────
        <Typography variant="h2" fontWeight={900} color="primary.main">
          {formatWorkoutTimerTime(secondsLeft)}
        </Typography>
      )}

      {/* ── Rep counter for standard (non-hybrid, non-prepare) modes ────── */}
      {!isPreparing && !isHybridMode && activeMode.goal > 0 ? (
        <Box>
          <Typography
            variant="subtitle2"
            color="secondary.main"
            fontWeight={800}
          >
            REP {currentRep} / {activeMode.goal}
          </Typography>
          {isActive && secondsToNextRep !== null && (
            <Typography variant="body2" color="text.secondary">
              Next in {secondsToNextRep}s
            </Typography>
          )}
        </Box>
      ) : !isPreparing && !isHybridMode ? (
        <Typography variant="body2" color="text.secondary">
          Beginner uses the selected level target for this 20-minute session.
        </Typography>
      ) : null}

      <Stack direction="row" spacing={1.5}>
        <Button
          variant="contained"
          startIcon={
            isPreparing ? (
              <PauseIcon />
            ) : isActive ? (
              <PauseIcon />
            ) : (
              <PlayArrowIcon />
            )
          }
          onClick={toggleTimer}
          color={isPreparing ? "warning" : "primary"}
        >
          {isPreparing
            ? "Cancel"
            : isActive
              ? "Pause"
              : phase === "done"
                ? "Restart"
                : "Start"}
        </Button>
        <Button
          variant="outlined"
          startIcon={<ReplayIcon />}
          onClick={resetTimer}
        >
          Reset
        </Button>
      </Stack>

      <Button
        variant="text"
        startIcon={<VideocamIcon />}
        onClick={onOpenVideo}
        sx={{ color: "text.secondary" }}
      >
        {isBeginnerTrack ? "Open Beginner Video" : "Open Tutorials"}
      </Button>
    </Card>
  );
}
