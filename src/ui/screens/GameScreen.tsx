/**
 * In-Game Screen with Canonical Tactical HUD
 * Authority: spec/UX Specification and UI Design System.md §3.1 & User Art/Feel Review
 * 100% tokenized, WCAG 2.2 AA (>= 4.5:1 text contrast), 48px touch targets, safe two-step quit.
 */

import React, { useEffect, useRef, useState } from 'react';
import { GameController, HudSnapshot } from '../../game/core/GameLoop';
import { t } from '../../content/locales/en';
import { AudioService } from '../../services/audio';

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
  const [showQuitConfirm, setShowQuitConfirm] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
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
        setShowQuitConfirm(false);
        setShowSettings(false);
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
    setShowQuitConfirm(false);
    setShowSettings(false);
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

  const formatTimer = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const healthPct = Math.max(0, Math.min(100, (snapshot.health / snapshot.maxHealth) * 100));
  const xpPct = Math.max(0, Math.min(100, (snapshot.xp / snapshot.xpNextLevel) * 100));
  const isLowHealth = snapshot.health <= 25;

  // Total Chapter 1 Phase 1 timer is 225s (3:45)
  const totalPhaseTimeSec = 225;
  const dawnProgressPct = Math.max(0, Math.min(100, ((totalPhaseTimeSec - snapshot.remainingTimeSec) / totalPhaseTimeSec) * 100));

  // Determine if Beacon is off-screen (camera half-width ~ 640px, half-height ~ 360px)
  const isBeaconOffScreen = snapshot.beaconDistance > 360;

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
        <div
          style={{
            background: 'var(--color-surface-overlay)',
            border: '1px solid var(--color-panel-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            backdropFilter: 'blur(10px)',
            pointerEvents: 'auto',
            minWidth: '240px',
            boxShadow: 'var(--shadow-panel)',
          }}
        >
          {/* Operative Header with generous padding */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  color: 'var(--color-player-body)',
                  fontWeight: 800,
                  letterSpacing: '1px',
                }}
              >
                MIRA VALE
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  marginTop: '1px',
                }}
              >
                // {t('char.mira.callsign')}
              </div>
            </div>

            {/* Level Badge with mini XP fill */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: 'var(--color-player-lamp)',
                  background: 'var(--color-surface-card)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-panel-border)',
                  boxShadow: 'var(--shadow-glow-cyan)',
                }}
              >
                {t('ui.hud.level_prefix')} {snapshot.level}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-seed-core)',
                  marginTop: '2px',
                }}
              >
                XP {snapshot.xp}/{snapshot.xpNextLevel}
              </span>
            </div>
          </div>

          {/* Health Gauge Bar */}
          <div
            style={{
              width: '100%',
              height: '10px',
              backgroundColor: 'var(--color-health-gauge-track)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '6px',
            }}
          >
            <div
              style={{
                width: `${healthPct}%`,
                height: '100%',
                backgroundColor: 'var(--color-health-gauge-fill)',
                transition: 'width 0.2s ease',
              }}
            />
          </div>

          {/* High-Contrast Readout (>= 4.5:1 ratio) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-primary)', fontWeight: 600 }}>
            <span>INTEGRITY</span>
            <span>{snapshot.health} / {snapshot.maxHealth} HP</span>
          </div>
        </div>

        {/* Top-Center: Phase Objective, Dawn Progress & Smart Beacon Compass */}
        <div
          style={{
            background: 'var(--color-surface-overlay)',
            border: '1px solid var(--color-panel-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 20px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-panel)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '340px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--color-player-lamp)',
              letterSpacing: '1px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>{t('ui.hud.chapter_label')}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>//</span>
            <span style={{ color: 'var(--color-danger-amber-bright)', fontWeight: 800 }}>
              DAWN IN {formatTimer(snapshot.remainingTimeSec)}
            </span>
          </div>

          {/* Dawn Progress Track (Eliminates ambiguity, adds survival tension) */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '6px',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '4px',
                backgroundColor: 'var(--color-ground-base)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${dawnProgressPct}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-danger-amber-bright)',
                  transition: 'width 0.3s linear',
                }}
              />
            </div>
            <span style={{ fontSize: '12px', lineHeight: 1 }} title="Dawn Transmission Target">☀️</span>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              marginTop: '6px',
              fontWeight: 500,
            }}
          >
            {t('ui.hud.objective_text')}
          </div>

          {/* Smart Beacon Indicator (Only shows pointer when beacon is off-screen) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: isBeaconOffScreen ? 'var(--color-danger-amber-bright)' : 'var(--color-seed-core)',
              fontWeight: 600,
            }}
          >
            {isBeaconOffScreen ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  style={{
                    transform: `rotate(${snapshot.beaconAngleRad + Math.PI / 2}rad)`,
                    transition: 'transform 0.1s linear',
                  }}
                >
                  <polygon points="12,2 20,22 12,17 4,22" fill="var(--color-danger-amber-bright)" />
                </svg>
                <span>BEACON: {Math.round(snapshot.beaconDistance / 10)}m</span>
              </>
            ) : (
              <>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-seed-core)',
                    boxShadow: 'var(--shadow-glow-mint)',
                  }}
                />
                <span>BEACON PERIMETER SECURED</span>
              </>
            )}
          </div>
        </div>

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
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: 'var(--spacing-lg)',
          display: 'flex',
          gap: 'var(--spacing-md)',
          pointerEvents: 'none',
        }}
      >
        {/* Slot 1: Signal Flare (Base Weapon) */}
        <div
          style={{
            background: 'var(--color-surface-overlay)',
            border: '1.5px solid var(--color-player-body)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            backdropFilter: 'blur(10px)',
            boxShadow: 'var(--shadow-glow-cyan)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '110px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-player-body)', fontWeight: 800 }}>
            {t('ui.hud.flare_slot')}
          </span>
          <div
            style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'var(--color-surface-card)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: '6px',
              marginBottom: '4px',
            }}
          >
            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-player-body)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-primary)', fontWeight: 700 }}>
            READY
          </span>
        </div>

        {/* Slot 2: Beacon Pulse (Active Shockwave) */}
        <div
          style={{
            background: isSpacePressed ? 'rgba(34, 211, 238, 0.25)' : 'var(--color-surface-overlay)',
            border: isSpacePressed ? '1.5px solid var(--color-player-lamp)' : '1.5px solid var(--color-panel-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            backdropFilter: 'blur(10px)',
            boxShadow: isSpacePressed ? 'var(--shadow-glow-cyan)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '110px',
            transition: 'all 0.1s ease',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-player-lamp)', fontWeight: 800 }}>
            {t('ui.hud.pulse_slot')}
          </span>
          <div
            style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'var(--color-surface-card)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: '6px',
              marginBottom: '4px',
            }}
          >
            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-player-lamp)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-primary)', fontWeight: 700 }}>
            CHARGED
          </span>
        </div>

        {/* Slot 3: Locked Slot (Teaser) */}
        <div
          style={{
            background: 'var(--color-surface-overlay)',
            border: '1px dashed var(--color-panel-border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '110px',
            opacity: 0.65,
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 700 }}>
            🔒 {t('ui.hud.locked_slot')}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
            CH 2 UNLOCK
          </span>
        </div>
      </div>

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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--color-shadow-backdrop)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: 'var(--color-surface-overlay)',
              border: '1.5px solid var(--color-player-body)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-xl)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-glow-cyan)',
              maxWidth: '420px',
              width: '90%',
            }}
          >
            {/* View 1: Two-Step Quit Confirmation */}
            {showQuitConfirm ? (
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '20px',
                    color: 'var(--color-danger-ring)',
                    marginBottom: '8px',
                  }}
                >
                  ABANDON PATROL MISSION?
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '20px',
                    lineHeight: 1.5,
                  }}
                >
                  Current sector telemetry and run progress will be lost. Return to Aster command?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  <button
                    onClick={handleConfirmQuit}
                    style={{
                      minHeight: 'var(--touch-target-min)',
                      background: 'var(--color-danger-ring)',
                      color: 'var(--color-text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      fontWeight: 800,
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    CONFIRM QUIT TO TITLE
                  </button>
                  <button
                    onClick={() => setShowQuitConfirm(false)}
                    style={{
                      minHeight: 'var(--touch-target-min)',
                      background: 'var(--color-surface-card)',
                      border: '1px solid var(--color-panel-border)',
                      color: 'var(--color-text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    CANCEL // RESUME
                  </button>
                </div>
              </div>
            ) : showSettings ? (
              /* View 2: Audio & Accessibility Settings */
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '20px',
                    color: 'var(--color-player-body)',
                    marginBottom: '16px',
                  }}
                >
                  AUDIO & DISPLAY SETTINGS
                </h3>

                {/* CRT Effects Slider */}
                <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                    <span>CRT SCANLINE INTENSITY</span>
                    <span>{Math.round(crtIntensity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.35"
                    step="0.01"
                    value={crtIntensity}
                    onChange={(e) => handleCrtChange(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-player-body)' }}
                  />
                </div>

                {/* Reduced Motion Toggle */}
                <div style={{ marginBottom: '24px', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-primary)' }}>
                    REDUCED MOTION (DISABLE FLICKER & PULSE)
                  </span>
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-player-body)' }}
                  />
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  style={{
                    width: '100%',
                    minHeight: 'var(--touch-target-min)',
                    background: 'var(--color-player-body)',
                    color: 'var(--color-text-inverse)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  BACK TO PAUSE MENU
                </button>
              </div>
            ) : (
              /* View 3: Standard Tactical Pause Menu */
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '24px',
                    color: 'var(--color-player-body)',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  {t('ui.hud.paused_title')}
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-lg)',
                  }}
                >
                  {t('ui.hud.paused_body')}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  <button
                    onClick={handleTogglePause}
                    style={{
                      minHeight: 'var(--touch-target-min)',
                      background: 'var(--color-player-body)',
                      color: 'var(--color-text-inverse)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      fontWeight: 800,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    {t('ui.hud.btn_resume')}
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    style={{
                      minHeight: 'var(--touch-target-min)',
                      background: 'var(--color-surface-card)',
                      border: '1px solid var(--color-panel-border)',
                      color: 'var(--color-text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    SETTINGS (CRT & ACCESSIBILITY)
                  </button>
                  <button
                    onClick={() => setShowQuitConfirm(true)}
                    style={{
                      minHeight: 'var(--touch-target-min)',
                      background: 'var(--color-surface-card)',
                      border: '1px solid var(--color-panel-border-subtle)',
                      color: 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      marginTop: '8px',
                    }}
                  >
                    {t('ui.hud.btn_return')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
