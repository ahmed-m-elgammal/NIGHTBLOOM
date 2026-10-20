import React from 'react';
import { t } from '../../content/locales/en';

interface TacticalArmamentDockProps {
  isSpacePressed: boolean;
}

export const TacticalArmamentDock: React.FC<TacticalArmamentDockProps> = ({ isSpacePressed }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        left: 'var(--spacing-lg)',
        display: 'flex',
        gap: 'var(--spacing-sm)',
        pointerEvents: 'auto',
      }}
    >
      {/* Slot 1: Signal Flare (Passive Auto-Fire) */}
      <div
        style={{
          background: 'var(--color-surface-overlay)',
          border: '1.5px solid var(--color-panel-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: '110px',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-player-body)', fontWeight: 700 }}>
          {t('ui.hud.flare_slot')}
        </span>
        <div
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'var(--color-ground-base)',
            borderRadius: '2px',
            overflow: 'hidden',
            margin: '8px 0 6px 0',
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
          background: isSpacePressed ? 'var(--color-ability-active-press)' : 'var(--color-surface-overlay)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              padding: '1px 5px',
              background: 'var(--color-surface-card)',
              border: '1px solid var(--color-panel-border)',
              borderRadius: '2px',
              color: 'var(--color-player-lamp)',
              fontWeight: 800,
            }}
          >
            SPACE
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-player-lamp)', fontWeight: 700 }}>
            {t('ui.hud.pulse_slot')}
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'var(--color-ground-base)',
            borderRadius: '2px',
            overflow: 'hidden',
            margin: '8px 0 6px 0',
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
  );
};
