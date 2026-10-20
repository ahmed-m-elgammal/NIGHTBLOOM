import React, { useState } from 'react';
import { t } from '../../content/locales/en';
import { AudioService } from '../../services/audio';

interface PauseModalProps {
  crtIntensity: number;
  reducedMotion: boolean;
  onCrtChange: (val: number) => void;
  onReducedMotionChange: (val: boolean) => void;
  onResume: () => void;
  onConfirmQuit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  crtIntensity,
  reducedMotion,
  onCrtChange,
  onReducedMotionChange,
  onResume,
  onConfirmQuit,
}) => {
  const [showQuitConfirm, setShowQuitConfirm] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  return (
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
                onClick={onConfirmQuit}
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
          /* View 2: Display & Accessibility Settings */
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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--color-text-primary)',
                  marginBottom: '6px',
                }}
              >
                <span>CRT SCANLINE INTENSITY</span>
                <span>{Math.round(crtIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.35"
                step="0.01"
                value={crtIntensity}
                onChange={(e) => onCrtChange(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-player-body)' }}
              />
            </div>

            {/* Reduced Motion Toggle */}
            <div
              style={{
                marginBottom: '24px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-primary)' }}>
                REDUCED MOTION (DISABLE FLICKER & PULSE)
              </span>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => onReducedMotionChange(e.target.checked)}
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
                onClick={onResume}
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
                onClick={() => {
                  setShowSettings(true);
                  AudioService.playBlip();
                }}
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
                onClick={() => {
                  setShowQuitConfirm(true);
                  AudioService.playBlip();
                }}
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
  );
};
