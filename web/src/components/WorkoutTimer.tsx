"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Box, Button, Card, Chip, Stack, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import VideocamIcon from "@mui/icons-material/Videocam";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
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
  onShowWarmup?: () => void;
  onShowCooldown?: () => void;
}

export default function WorkoutTimer({
  tier,
  sealsGoal = 0,
  sixCountsGoal = 0,
  defaultMode,
  onFinish,
  onOpenVideo,
  onShowWarmup,
  onShowCooldown,
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

  // ── Warmup prompt state ──────────────────────────────────────────────────
  const [warmupChecked, setWarmupChecked] = useState(false);
  const [showWarmupPrompt, setShowWarmupPrompt] = useState(false);

  const isBeginnerTrack = tier === "beginner";
  const isPreparing = phase === "prepare";
  const isDone = phase === "done";
  const isHybridMode = activeMode.mode === "H";
  const isIdle = phase === "idle";

  // Intercept the first Start press to ask about warm-up
  const handleStartClick = useCallback(() => {
    if (!warmupChecked && !isActive && !isPreparing && phase !== "done") {
      setShowWarmupPrompt(true);
      return;
    }
    toggleTimer();
  }, [warmupChecked, isActive, isPreparing, phase, toggleTimer]);

  const handleConfirmWarmup = useCallback(() => {
    setWarmupChecked(true);
    setShowWarmupPrompt(false);
    toggleTimer();
  }, [toggleTimer]);

  const handleShowWarmupFromPrompt = useCallback(() => {
    setShowWarmupPrompt(false);
    onShowWarmup?.();
  }, [onShowWarmup]);

  const handleResetTimer = useCallback(() => {
    setWarmupChecked(false);
    setShowWarmupPrompt(false);
    resetTimer();
  }, [resetTimer]);

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

      {/* ── Idle warm-up reminder ────────────────────────────────────────── */}
      {isIdle && !showWarmupPrompt && (
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontStyle: "italic",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <FitnessCenterIcon sx={{ fontSize: 14 }} />
          Warm up first. Train smart.
        </Typography>
      )}

      {/* ── "Did you warm up?" prompt ────────────────────────────────────── */}
      {showWarmupPrompt ? (
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
              onClick={handleConfirmWarmup}
            >
              Yes, Start Workout
            </Button>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              startIcon={<FitnessCenterIcon />}
              onClick={handleShowWarmupFromPrompt}
            >
              Show Warm-up
            </Button>
          </Stack>
        </Box>
      ) : (
        /* ── Normal control buttons ───────────────────────────────────── */
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
            onClick={handleStartClick}
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
            onClick={handleResetTimer}
          >
            Reset
          </Button>
        </Stack>
      )}

      {/* ── Post-workout cool-down reminder ─────────────────────────────── */}
      {isDone && !showWarmupPrompt && (
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
      )}

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
