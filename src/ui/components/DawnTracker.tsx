import React from 'react';
import { t } from '../../content/locales/en';
import { GAME_CONFIG } from '../../game/config/gameConfig';

interface DawnTrackerProps {
  remainingTimeSec: number;
  beaconDistance: number;
  beaconAngleRad: number;
}

export const DawnTracker: React.FC<DawnTrackerProps> = ({
  remainingTimeSec,
  beaconDistance,
  beaconAngleRad,
}) => {
  const formatTimer = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalPhaseTimeSec = GAME_CONFIG.chapter.phaseDurationSec;
  const dawnProgressPct = Math.max(0, Math.min(100, ((totalPhaseTimeSec - remainingTimeSec) / totalPhaseTimeSec) * 100));
  const isBeaconOffScreen = beaconDistance > 360;

  return (
    <div
      style={{
        background: 'var(--color-surface-overlay)',
        border: '1px solid var(--color-panel-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '8px 18px',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-panel)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '340px',
        lineHeight: 1,
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
          DAWN IN {formatTimer(remainingTimeSec)}
        </span>
      </div>

      {/* Dawn Progress Track */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '4px',
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger-amber-bright)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Dawn Transmission Target" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="5" fill="var(--color-danger-amber-bright)" />
            <line x1="12" y1="1" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
            <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
            <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
          </svg>
        </div>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
          marginTop: '4px',
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
          marginTop: '4px',
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
                transform: `rotate(${beaconAngleRad + Math.PI / 2}rad)`,
                transition: 'transform 0.1s linear',
              }}
            >
              <polygon points="12,2 20,22 12,17 4,22" fill="var(--color-danger-amber-bright)" />
            </svg>
            <span>BEACON: {Math.round(beaconDistance / 10)}m</span>
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
  );
};
