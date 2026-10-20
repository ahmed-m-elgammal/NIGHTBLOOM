import React, { useEffect, useState } from 'react';
import { Bark } from '../../game/content/schemas/character';
import { AudioService } from '../../services/audio';
import { t } from '../../content/locales/en';

interface RadioTransmissionProps {
  currentBark: Bark;
  onBarkSelect: (bark: Bark) => void;
  availableBarks: Bark[];
}

export const RadioTransmission: React.FC<RadioTransmissionProps> = ({
  currentBark,
  onBarkSelect,
  availableBarks,
}) => {
  const [displayedText, setDisplayedText] = useState('');

  const fullLine = t(currentBark.lineId);

  // Typewriter effect derived from dialogue string length
  useEffect(() => {
    setDisplayedText('');
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx <= fullLine.length) {
        setDisplayedText(fullLine.slice(0, idx));
      } else {
        clearInterval(interval);
      }
    }, 22);

    return () => clearInterval(interval);
  }, [fullLine]);

  const handleTrigger = (bark: Bark) => {
    AudioService.playRadioChirp(bark.emotion);
    onBarkSelect(bark);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
        background: 'var(--color-surface-card)',
        border: '1px solid var(--color-panel-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-md)',
        boxShadow: 'var(--shadow-panel)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Radio Transmission Header & Waveform */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--color-panel-border-subtle)',
          paddingBottom: 'var(--spacing-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-player-lamp)',
              boxShadow: 'var(--shadow-glow-cyan)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '1px',
              color: 'var(--color-player-lamp)',
              fontWeight: 700,
            }}
          >
            {t('ui.radio.live_header')}
          </span>
        </div>

        {/* Animated Oscilloscope Bars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '18px' }}>
          {[14, 22, 10, 26, 18, 24, 12, 20, 8, 24].map((h, i) => (
            <div
              key={i}
              style={{
                width: '3px',
                height: `${h}px`,
                backgroundColor: 'var(--color-player-body)',
                borderRadius: '1px',
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      </div>

      {/* Caption Box */}
      <div
        style={{
          minHeight: '68px',
          padding: '10px 14px',
          background: 'var(--color-ground-base)',
          borderLeft: '3px solid var(--color-player-body)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-text-secondary)',
            marginBottom: '4px',
          }}
        >
          {t(currentBark.speakerNameId).toUpperCase()} · {t(currentBark.triggerId).toUpperCase()}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            color: 'var(--color-text-primary)',
            lineHeight: 1.4,
            fontWeight: 500,
          }}
        >
          "{displayedText}"
          <span style={{ color: 'var(--color-player-body)' }}>_</span>
        </div>
      </div>

      {/* Trigger Buttons (Enforces 48px touch target per AGENTS.md §5.2) */}
      <div>
        <div
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--spacing-xs)',
            letterSpacing: '0.5px',
          }}
        >
          {t('ui.radio.simulate_prompt')}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
          {availableBarks.map((bark) => {
            const isSelected = bark.id === currentBark.id;
            return (
              <button
                key={bark.id}
                onClick={() => handleTrigger(bark)}
                style={{
                  minHeight: 'var(--touch-target-min)',
                  minWidth: 'var(--touch-target-min)',
                  padding: '8px 16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isSelected
                    ? 'var(--color-surface-card-hover)'
                    : 'var(--color-surface-overlay)',
                  color: isSelected
                    ? 'var(--color-player-lamp)'
                    : 'var(--color-text-secondary)',
                  border: isSelected
                    ? '1px solid var(--color-player-body)'
                    : '1px solid var(--color-panel-border-subtle)',
                  boxShadow: isSelected ? 'var(--shadow-glow-cyan)' : 'none',
                }}
              >
                {t(bark.triggerId)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
