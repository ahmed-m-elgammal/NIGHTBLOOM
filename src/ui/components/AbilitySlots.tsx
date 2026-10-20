import React from 'react';
import { AbilityConfig } from '../../game/content/schemas/character';
import { t } from '../../content/locales/en';
import { AudioService } from '../../services/audio';

interface AbilitySlotsProps {
  abilities: AbilityConfig[];
}

export const AbilitySlots: React.FC<AbilitySlotsProps> = ({ abilities }) => {
  const handleAbilityClick = () => {
    AudioService.playPulseHum();
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--spacing-sm)',
      }}
    >
      {abilities.map((ability) => {
        const isPulse = ability.iconType === 'pulse';
        const accentVar = isPulse ? 'var(--color-player-body)' : 'var(--color-hostile-core)';

        return (
          <div
            key={ability.id}
            onClick={handleAbilityClick}
            tabIndex={0}
            role="button"
            aria-label={t(ability.nameId)}
            style={{
              background: 'var(--color-surface-card)',
              border: '1px solid var(--color-panel-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-md)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              minHeight: 'var(--touch-target-min)',
              transition: 'border-color 0.2s ease, transform 0.15s ease',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: accentVar,
                    fontWeight: 700,
                  }}
                >
                  {ability.keyBindingId ? t(ability.keyBindingId) : ability.type.toUpperCase()}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {ability.cooldownSec}s
                </span>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '15px',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                {t(ability.nameId)}
              </div>

              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.4,
                  marginBottom: 'var(--spacing-sm)',
                }}
              >
                {t(ability.descId)}
              </div>
            </div>

            {/* Spec Parameter Matrix */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                paddingTop: 'var(--spacing-xs)',
                borderTop: '1px solid var(--color-panel-border-subtle)',
              }}
            >
              {Object.entries(ability.parameters).map(([key, val]) => (
                <span
                  key={key}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--color-text-muted)',
                    background: 'var(--color-ground-base)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {key}: <strong style={{ color: 'var(--color-text-primary)' }}>{String(val)}</strong>
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
