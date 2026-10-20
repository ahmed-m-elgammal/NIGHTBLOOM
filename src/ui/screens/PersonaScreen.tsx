import React, { useState } from 'react';
import { PersonaDef, EmotionState, Bark } from '../../game/content/schemas/character';
import { VectorPortrait } from '../components/VectorPortrait';
import { TelemetryGauges } from '../components/TelemetryGauges';
import { AbilitySlots } from '../components/AbilitySlots';
import { RadioTransmission } from '../components/RadioTransmission';
import { t } from '../../content/locales/en';
import { AudioService } from '../../services/audio';

interface PersonaScreenProps {
  hero: PersonaDef;
  onBack: () => void;
}

export const PersonaScreen: React.FC<PersonaScreenProps> = ({ hero, onBack }) => {
  const [emotion, setEmotion] = useState<EmotionState>('neutral');
  const [activeBark, setActiveBark] = useState<Bark>(hero.starterBarks[0]);

  const handleEmotionChange = (newEmotion: EmotionState) => {
    AudioService.playBlip();
    setEmotion(newEmotion);
  };

  const handleBarkSelect = (bark: Bark) => {
    setActiveBark(bark);
    setEmotion(bark.emotion);
  };

  const handleBack = () => {
    AudioService.playBlip();
    onBack();
  };

  return (
    <div
      className="viewport-frame"
      style={{
        padding: 'var(--spacing-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
        overflowY: 'auto',
      }}
    >
      {/* Header Bar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 'var(--spacing-sm)',
          borderBottom: '1px solid var(--color-panel-border)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '2px 8px',
                background: 'var(--color-signal-cyan-ghost)',
                color: 'var(--color-player-body)',
                border: '1px solid var(--color-panel-border)',
                borderRadius: 'var(--radius-sm)',
                letterSpacing: '1px',
              }}
            >
              {t('ui.dossier.badge')}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              {t('ui.dossier.sig_freq')}
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '26px',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              letterSpacing: '0.5px',
              marginTop: '4px',
            }}
          >
            {t(hero.nameId).toUpperCase()} // {t(hero.callsignId)}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            {t(hero.roleId)} — <em style={{ color: 'var(--color-player-lamp)' }}>"{t(hero.quoteId)}"</em>
          </p>
        </div>

        {/* Back Button & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <button
            onClick={handleBack}
            style={{
              minHeight: 'var(--touch-target-min)',
              padding: '6px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-surface-card)',
              border: '1px solid var(--color-panel-border)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
            }}
          >
            ← {t('ui.dossier.btn_back')}
          </button>
        </div>
      </header>

      {/* Main Grid: Left Column (Portrait + Bio) / Right Column (Systems) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: 'var(--spacing-md)',
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Left Column: Vector Portrait & Psychological Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <VectorPortrait emotion={emotion} size={320} />

          {/* Emotion State Toggle Pill */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              background: 'var(--color-surface-card)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-panel-border)',
            }}
          >
            {(['neutral', 'worried', 'relieved'] as const).map((st) => {
              const isSelected = emotion === st;
              const stateKey = `state.${st}` as const;
              return (
                <button
                  key={st}
                  onClick={() => handleEmotionChange(st)}
                  style={{
                    flex: 1,
                    minHeight: 'var(--touch-target-min)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? 'var(--color-surface-card-hover)' : 'transparent',
                    color: isSelected ? 'var(--color-player-body)' : 'var(--color-text-secondary)',
                    border: isSelected ? '1px solid var(--color-player-body)' : 'none',
                  }}
                >
                  {t(stateKey)}
                </button>
              );
            })}
          </div>

          {/* Psychological Profile Attributes */}
          <div
            style={{
              background: 'var(--color-surface-card)',
              border: '1px solid var(--color-panel-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-sm)',
              fontSize: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-player-body)', fontWeight: 700 }}>
                {t('ui.psy.want')}:
              </span>{' '}
              <span style={{ color: 'var(--color-text-secondary)' }}>{t(hero.lore.wantId)}</span>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-seed-core)', fontWeight: 700 }}>
                {t('ui.psy.need')}:
              </span>{' '}
              <span style={{ color: 'var(--color-text-secondary)' }}>{t(hero.lore.needId)}</span>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-hostile-core)', fontWeight: 700 }}>
                {t('ui.psy.flaw')}:
              </span>{' '}
              <span style={{ color: 'var(--color-text-secondary)' }}>{t(hero.lore.flawId)}</span>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-danger-ring)', fontWeight: 700 }}>
                {t('ui.psy.fear')}:
              </span>{' '}
              <span style={{ color: 'var(--color-text-secondary)' }}>{t(hero.lore.fearId)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry, Armaments, Radio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* Telemetry Section */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
              {t('ui.section.telemetry')}
            </div>
            <TelemetryGauges stats={hero.baseStats} />
          </div>

          {/* Armament Abilities Section */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
              {t('ui.section.armaments')}
            </div>
            <AbilitySlots abilities={hero.abilities} />
          </div>

          {/* Tactical Radio Overlay */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
              {t('ui.section.transmission')}
            </div>
            <RadioTransmission
              currentBark={activeBark}
              onBarkSelect={handleBarkSelect}
              availableBarks={hero.starterBarks}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
