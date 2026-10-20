import React from 'react';
import { PersonaDef } from '../../game/content/schemas/character';
import { t } from '../../content/locales/en';

interface PsychologicalProfileCardProps {
  hero: PersonaDef;
}

export const PsychologicalProfileCard: React.FC<PsychologicalProfileCardProps> = ({ hero }) => {
  return (
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
  );
};
