import React from 'react';

export const MissionBriefingCard: React.FC = () => {
  return (
    <div
      style={{
        padding: '2px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, var(--color-panel-border) 0%, transparent 60%)',
        boxShadow: 'var(--shadow-panel)',
        maxWidth: '480px',
        justifySelf: 'end',
      }}
    >
      <div
        style={{
          padding: 'var(--spacing-lg)',
          borderRadius: 'calc(var(--radius-lg) - 2px)',
          background: 'var(--color-surface-overlay)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--color-panel-border-subtle)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-player-body)',
            letterSpacing: '1px',
            marginBottom: '8px',
            fontWeight: 700,
          }}
        >
          MISSION LOG // CONVOY SIGNAL KEEPER
        </div>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '14px',
          }}
        >
          The <strong>Tenth Column</strong> is navigating the Grey Season storm front. Mira Vale must patrol the Nightbloom field, relight the Nursery Beacon, and maintain 104.2 MHz signal integrity against approaching spores.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            paddingTop: '10px',
            borderTop: '1px solid var(--color-panel-border-subtle)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
          }}
        >
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>OPERATIVE:</span>{' '}
            <strong style={{ color: 'var(--color-player-body)' }}>MIRA VALE</strong>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>STATUS:</span>{' '}
            <strong style={{ color: 'var(--color-seed-core)' }}>READY</strong>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>SIGNAL COIL:</span>{' '}
            <strong style={{ color: 'var(--color-hostile-core)' }}>DAMPENED</strong>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>STORM FRONT:</span>{' '}
            <strong style={{ color: 'var(--color-danger-ring)' }}>APPROACHING</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
