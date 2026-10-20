import React, { useState, useEffect } from 'react';
import { t } from '../../content/locales/en';
import { AudioService } from '../../services/audio';
import { MissionBriefingCard } from '../components/MissionBriefingCard';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenDossier: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenDossier,
}) => {
  const [focusedIdx, setFocusedIdx] = useState<number>(0);

  const handleStart = () => {
    AudioService.playPulseHum();
    onStartGame();
  };

  const handleDossier = () => {
    AudioService.playBlip();
    onOpenDossier();
  };

  const menuItems = [
    { key: 'start', labelKey: 'ui.title.btn_start' as const, action: handleStart },
    { key: 'dossier', labelKey: 'ui.title.btn_dossier' as const, action: handleDossier },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setFocusedIdx((prev) => (prev + 1) % menuItems.length);
        AudioService.playBlip();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setFocusedIdx((prev) => (prev - 1 + menuItems.length) % menuItems.length);
        AudioService.playBlip();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        menuItems[focusedIdx].action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIdx]);

  return (
    <div
      className="screen-root"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'var(--spacing-xl)',
        background: 'radial-gradient(circle at 75% 40%, var(--color-ground-elevated) 0%, var(--color-ground-base) 85%)',
      }}
    >
      {/* Top Telemetry Ticker Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          borderBottom: '1px solid var(--color-panel-border-subtle)',
          paddingBottom: 'var(--spacing-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-player-lamp)',
              boxShadow: 'var(--shadow-glow-cyan)',
            }}
          />
          <span style={{ color: 'var(--color-player-body)', letterSpacing: '1px', fontWeight: 700 }}>
            {t('ui.hud.beacon_status')}
          </span>
        </div>
        <span style={{ letterSpacing: '1px' }}>{t('ui.title.sector')}</span>
      </header>

      {/* Main Game Title & Left-Aligned Tactical Menu Stack */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '520px 1fr',
          gap: 'var(--spacing-xl)',
          alignItems: 'center',
          flex: 1,
        }}
      >
        {/* Left Column: Big Game Title & Menu Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--color-hostile-core)',
                letterSpacing: '2px',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              {t('ui.app.subtitle')}
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '64px',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                letterSpacing: '4px',
                lineHeight: 1.0,
                textTransform: 'uppercase',
                textShadow: '0 0 35px var(--color-signal-cyan-glow)',
                margin: 0,
              }}
            >
              {t('ui.app.title')}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: 'var(--color-text-secondary)',
                marginTop: '12px',
                lineHeight: 1.5,
                fontStyle: 'italic',
                maxWidth: '460px',
              }}
            >
              "{t('ui.title.tagline')}"
            </p>
          </div>

          {/* Tactical Game Menu Column */}
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)',
              maxWidth: '360px',
            }}
          >
            {menuItems.map((item, idx) => {
              const isFocused = focusedIdx === idx;
              return (
                <button
                  key={item.key}
                  onClick={item.action}
                  onMouseEnter={() => {
                    AudioService.playBlip();
                    setFocusedIdx(idx);
                  }}
                  style={{
                    minHeight: 'var(--touch-target-min)',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-sm)',
                    background: isFocused
                      ? 'var(--color-surface-card-active)'
                      : 'var(--color-surface-card)',
                    border: isFocused
                      ? '1px solid var(--color-player-body)'
                      : '1px solid var(--color-panel-border)',
                    boxShadow: isFocused ? 'var(--shadow-glow-cyan)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    color: isFocused
                      ? 'var(--color-player-lamp)'
                      : 'var(--color-text-primary)',
                    transform: isFocused ? 'translateX(6px)' : 'translateX(0)',
                    transition: 'all 0.15s cubic-bezier(0.32, 0.72, 0, 1)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: isFocused ? 'var(--color-player-body)' : 'var(--color-text-muted)' }}>
                      {isFocused ? '►' : '▷'}
                    </span>
                    {t(item.labelKey)}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: isFocused ? 'var(--color-player-body)' : 'var(--color-text-muted)',
                    }}
                  >
                    {idx === 0 ? '[ENTER]' : '[TAB]'}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Column: Mission Briefing Card (Double-Bezel Tactical Hardware Panel) */}
        <MissionBriefingCard />
      </div>

      {/* Footer Navigation Advisory */}
      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          borderTop: '1px solid var(--color-panel-border-subtle)',
          paddingTop: 'var(--spacing-sm)',
        }}
      >
        <span>{t('ui.title.controls_hint')}</span>
        <span>{t('ui.title.version')}</span>
      </footer>
    </div>
  );
};
