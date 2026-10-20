import React from 'react';
import { PersonaDef } from '../../game/content/schemas/character';
import { t } from '../../content/locales/en';

interface TelemetryGaugesProps {
  stats: PersonaDef['baseStats'];
}

export const TelemetryGauges: React.FC<TelemetryGaugesProps> = ({ stats }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--spacing-sm)',
      }}
    >
      {/* Max Integrity Meter */}
      <div
        style={{
          background: 'var(--color-surface-card)',
          border: '1px solid var(--color-panel-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
          {t('ui.telemetry.max_health')}
        </span>
        <div style={{ position: 'relative', width: '64px', height: '64px', margin: '4px 0' }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--color-health-gauge-track)"
              strokeWidth="3.2"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--color-health-gauge-fill)"
              strokeDasharray="100, 100"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '14px',
              color: 'var(--color-text-primary)',
            }}
          >
            {stats.maxHealth}
          </div>
        </div>
        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-health-gauge-fill)' }}>
          {t('ui.telemetry.health_unit')}
        </span>
      </div>

      {/* Movement Speed */}
      <div
        style={{
          background: 'var(--color-surface-card)',
          border: '1px solid var(--color-panel-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
          {t('ui.telemetry.velocity')}
        </span>
        <div style={{ position: 'relative', width: '64px', height: '64px', margin: '4px 0' }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--color-signal-cyan-ghost)"
              strokeWidth="3.2"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--color-player-body)"
              strokeDasharray="75, 100"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '13px',
              color: 'var(--color-text-primary)',
            }}
          >
            {stats.moveSpeed}
          </div>
        </div>
        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-player-body)' }}>
          {t('ui.telemetry.velocity_unit')}
        </span>
      </div>

      {/* Seed Magnet Magnet */}
      <div
        style={{
          background: 'var(--color-surface-card)',
          border: '1px solid var(--color-panel-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
          {t('ui.telemetry.seed_magnet')}
        </span>
        <div style={{ position: 'relative', width: '64px', height: '64px', margin: '4px 0' }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--color-seed-ghost)"
              strokeWidth="3.2"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--color-seed-core)"
              strokeDasharray="60, 100"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '14px',
              color: 'var(--color-text-primary)',
            }}
          >
            {stats.pickupRadius}
          </div>
        </div>
        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-seed-core)' }}>
          {t('ui.telemetry.seed_magnet_unit')}
        </span>
      </div>

      {/* Recovery I-Frame */}
      <div
        style={{
          background: 'var(--color-surface-card)',
          border: '1px solid var(--color-panel-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
          {t('ui.telemetry.recovery')}
        </span>
        <div style={{ position: 'relative', width: '64px', height: '64px', margin: '4px 0' }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--color-danger-amber-ghost)"
              strokeWidth="3.2"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--color-hostile-core)"
              strokeDasharray="45, 100"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '13px',
              color: 'var(--color-text-primary)',
            }}
          >
            {stats.hitInvulnerabilitySec}s
          </div>
        </div>
        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-hostile-core)' }}>
          {t('ui.telemetry.recovery_unit')}
        </span>
      </div>
    </div>
  );
};
