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
        bottom: 'var(--safe-area-y)',
        left: 'var(--safe-area-x)',
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
          minWidth: '120px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-player-body)" strokeWidth="2.2">
            <line x1="6" y1="18" x2="18" y2="6" />
            <circle cx="18" cy="6" r="3" fill="var(--color-player-lamp)" />
            <path d="M 6 18 Q 8 10 18 6" stroke="var(--color-signal-cyan-ghost)" />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-player-body)', fontWeight: 700 }}>
            {t('ui.hud.flare_slot')}
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'var(--color-ground-base)',
            borderRadius: '2px',
            overflow: 'hidden',
            margin: '6px 0',
          }}
        >
          <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-player-body)' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-primary)', fontWeight: 700, letterSpacing: '0.5px' }}>
          AUTO // READY
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
          minWidth: '120px',
          transition: 'all 0.1s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
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
            margin: '6px 0',
          }}
        >
          <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-player-lamp)' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-primary)', fontWeight: 700, letterSpacing: '0.5px' }}>
          104.2 MHz // CHARGED
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
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          {t('ui.hud.locked_slot')}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
          CH 2 UNLOCK
        </span>
      </div>
    </div>
  );
};
