import React from 'react';
import { t } from '../../content/locales/en';

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

  const totalPhaseTimeSec = 225;
  const dawnProgressPct = Math.max(0, Math.min(100, ((totalPhaseTimeSec - remainingTimeSec) / totalPhaseTimeSec) * 100));
  const isBeaconOffScreen = beaconDistance > 360;

  return (
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
