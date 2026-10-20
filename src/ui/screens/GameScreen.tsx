/**
 * In-Game Screen with Canonical Tactical HUD
 * Authority: spec/UX Specification and UI Design System.md §3.1 & User Art/Feel Review
 * 100% tokenized, WCAG 2.2 AA (>= 4.5:1 text contrast), 48px touch targets, safe two-step quit.
 */

import React, { useEffect, useRef, useState } from 'react';
import { GameController, HudSnapshot } from '../../game/core/GameLoop';
import { t } from '../../content/locales/en';
import { AudioService } from '../../services/audio';
import { OperativeStatusCard } from '../components/OperativeStatusCard';
import { DawnTracker } from '../components/DawnTracker';
import { TacticalArmamentDock } from '../components/TacticalArmamentDock';
import { PauseModal } from '../components/PauseModal';

interface GameScreenProps {
  onReturnToTitle: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onReturnToTitle }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<GameController | null>(null);

  const [snapshot, setSnapshot] = useState<HudSnapshot>({
    playerX: 1600,
    playerY: 1340,
    speed: 0,
    isMoving: false,
    beaconDistance: 140,
    beaconAngleRad: -Math.PI / 2,
    health: 100,
    maxHealth: 100,
    level: 1,
    xp: 0,
    xpNextLevel: 100,
    defeatedCount: 0,
    remainingTimeSec: 225,
  });

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [crtIntensity, setCrtIntensity] = useState<number>(0.12);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Apply CRT opacity CSS variable to document root
    document.documentElement.style.setProperty('--setting-crt-opacity', crtIntensity.toString());

    // Initialize GameController with 10 Hz throttled React bridge
    const controller = new GameController(canvas, (newSnapshot) => {
      setSnapshot(newSnapshot);
    });
    controllerRef.current = controller;

    const handleResize = () => controller.resize();
    window.addEventListener('resize', handleResize);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        const next = !controller.getPaused();
        controller.setPaused(next);
        setIsPaused(next);
        AudioService.playBlip();
      } else if (e.code === 'Space') {
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      controller.dispose();
      controllerRef.current = null;
    };
  }, []);

  const handleCrtChange = (val: number) => {
    setCrtIntensity(val);
    document.documentElement.style.setProperty('--setting-crt-opacity', val.toString());
  };

  const handleTogglePause = () => {
    if (!controllerRef.current) return;
    const next = !isPaused;
    controllerRef.current.setPaused(next);
    setIsPaused(next);
    AudioService.playBlip();
  };

  const handleConfirmQuit = () => {
    AudioService.playBlip();
    if (controllerRef.current) {
      controllerRef.current.dispose();
      controllerRef.current = null;
    }
    onReturnToTitle();
  };

  const xpPct = Math.max(0, Math.min(100, (snapshot.xp / snapshot.xpNextLevel) * 100));
  const isLowHealth = snapshot.health <= 25;

  return (
    <div className={`viewport-frame ${isLowHealth && !reducedMotion ? 'low-hp-vignette' : ''}`} style={{ position: 'relative' }}>
      {/* Canvas 2D Game World */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />

      {/* TOP HUD BAR (Safe Margin Positioned) */}
      <div
        style={{
          position: 'absolute',
          top: 'var(--spacing-md)',
          left: 'var(--spacing-lg)',
          right: 'var(--spacing-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pointerEvents: 'none',
          gap: 'var(--spacing-md)',
        }}
      >
        {/* Top-Left: Operative Health & Status */}
        <OperativeStatusCard
          level={snapshot.level}
          xp={snapshot.xp}
          xpNextLevel={snapshot.xpNextLevel}
          health={snapshot.health}
          maxHealth={snapshot.maxHealth}
        />

        {/* Top-Center: Phase Objective, Dawn Progress & Smart Beacon Compass */}
        <DawnTracker
          remainingTimeSec={snapshot.remainingTimeSec}
          beaconDistance={snapshot.beaconDistance}
          beaconAngleRad={snapshot.beaconAngleRad}
        />

        {/* Top-Right: Defeated Counter & Protected Pause Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', pointerEvents: 'auto' }}>
          <div
            style={{
              background: 'var(--color-surface-overlay)',
              border: '1px solid var(--color-panel-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 14px',
              backdropFilter: 'blur(10px)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
            }}
          >
            {t('ui.hud.defeated_label')}: <strong style={{ color: 'var(--color-danger-amber-bright)', fontSize: '13px' }}>{snapshot.defeatedCount}</strong>
          </div>

          <button
            onClick={handleTogglePause}
            style={{
              minHeight: 'var(--touch-target-min)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-surface-card)',
              border: '1px solid var(--color-panel-border)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-panel)',
            }}
          >
            {t('ui.hud.btn_pause')}
          </button>
        </div>
      </div>

      {/* BOTTOM-LEFT: Tactical Armament Slots (with Rich Visual Cooldown & Press Flash) */}
      <TacticalArmamentDock isSpacePressed={isSpacePressed} />

      {/* BOTTOM SPANNING XP GAUGE */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '6px',
          backgroundColor: 'var(--color-surface-overlay)',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: `${xpPct}%`,
            height: '100%',
            backgroundColor: 'var(--color-seed-core)',
            boxShadow: 'var(--shadow-glow-mint)',
            transition: 'width 0.2s ease',
          }}
        />
      </div>

      {/* PAUSE MODAL OVERLAY (With Safe Confirm Step & Settings) */}
      {isPaused && (
        <PauseModal
          crtIntensity={crtIntensity}
          reducedMotion={reducedMotion}
          onCrtChange={handleCrtChange}
          onReducedMotionChange={setReducedMotion}
          onResume={handleTogglePause}
          onConfirmQuit={handleConfirmQuit}
        />
      )}
    </div>
  );
};
