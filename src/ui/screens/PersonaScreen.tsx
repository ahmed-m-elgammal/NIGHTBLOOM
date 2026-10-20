import React, { useState } from 'react';
import { PersonaDef, EmotionState, Bark } from '../../game/content/schemas/character';
import { VectorPortrait } from '../components/VectorPortrait';
import { TelemetryGauges } from '../components/TelemetryGauges';
import { AbilitySlots } from '../components/AbilitySlots';
import { RadioTransmission } from '../components/RadioTransmission';
import { t } from '../../content/locales/en';
import { AudioService } from '../../services/audio';

import { EquipmentInspector } from '../components/EquipmentInspector';
import { PsychologicalProfileCard } from '../components/PsychologicalProfileCard';

interface PersonaScreenProps {
  hero: PersonaDef;
  onBack: () => void;
}

export const PersonaScreen: React.FC<PersonaScreenProps> = ({ hero, onBack }) => {
  const [activeTab, setActiveTab] = useState<'dossier' | 'equipment'>('dossier');
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

  const handleTabChange = (tab: 'dossier' | 'equipment') => {
    AudioService.playBlip();
    setActiveTab(tab);
  };

  return (
    <div
      className="screen-root"
      style={{
        padding: 'var(--spacing-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
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

        {/* Tab Controls & Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <div style={{ display: 'flex', gap: '4px', background: 'var(--color-surface-card)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-panel-border)' }}>
            <button
              onClick={() => handleTabChange('dossier')}
              style={{
                padding: '6px 12px',
                minHeight: 'var(--touch-target-min)',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'dossier' ? 'var(--color-surface-card-active)' : 'transparent',
                border: activeTab === 'dossier' ? '1px solid var(--color-player-body)' : 'none',
                color: activeTab === 'dossier' ? 'var(--color-player-lamp)' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              01 // DOSSIER
            </button>
            <button
              onClick={() => handleTabChange('equipment')}
              style={{
                padding: '6px 12px',
                minHeight: 'var(--touch-target-min)',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'equipment' ? 'var(--color-surface-card-active)' : 'transparent',
                border: activeTab === 'equipment' ? '1px solid var(--color-player-body)' : 'none',
                color: activeTab === 'equipment' ? 'var(--color-player-lamp)' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              02 // FIELD LOADOUT
            </button>
          </div>

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
              cursor: 'pointer',
            }}
          >
            ← {t('ui.dossier.btn_back')}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === 'equipment' ? (
        <EquipmentInspector />
      ) : (
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
                      cursor: 'pointer',
                    }}
                  >
                    {t(stateKey)}
                  </button>
                );
              })}
            </div>

            <PsychologicalProfileCard hero={hero} />
          </div>

          {/* Right Column: Telemetry, Armaments, Radio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                {t('ui.section.telemetry')}
              </div>
              <TelemetryGauges stats={hero.baseStats} />
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                {t('ui.section.armaments')}
              </div>
              <AbilitySlots abilities={hero.abilities} />
            </div>

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
      )}
    </div>
  );
};
