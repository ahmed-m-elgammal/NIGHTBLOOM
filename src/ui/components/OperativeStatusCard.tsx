import React from 'react';
import { t } from '../../content/locales/en';

interface OperativeStatusCardProps {
  level: number;
  xp: number;
  xpNextLevel: number;
  health: number;
  maxHealth: number;
}

export const OperativeStatusCard: React.FC<OperativeStatusCardProps> = ({
  level,
  xp,
  xpNextLevel,
  health,
  maxHealth,
}) => {
  const healthPct = Math.max(0, Math.min(100, (health / maxHealth) * 100));

  return (
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
            {t('ui.hud.level_prefix')} {level}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-seed-core)',
              marginTop: '2px',
            }}
          >
            XP {xp}/{xpNextLevel}
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
        <span>{health} / {maxHealth} HP</span>
      </div>
    </div>
  );
};
