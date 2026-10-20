import React, { useId } from 'react';
import { t } from '../../../content/locales/en';

interface PauseSettingsViewProps {
  titleId: string;
  crtIntensity: number;
  reducedMotion: boolean;
  darknessDensity: number;
  onCrtChange: (val: number) => void;
  onReducedMotionChange: (val: boolean) => void;
  onDarknessChange: (val: number) => void;
  onBack: () => void;
}

export const PauseSettingsView: React.FC<PauseSettingsViewProps> = ({
  titleId,
  crtIntensity,
  reducedMotion,
  darknessDensity,
  onCrtChange,
  onReducedMotionChange,
  onDarknessChange,
  onBack,
}) => {
  const crtId = useId();
  const darknessId = useId();

  return (
    <div>
      <h2
        id={titleId}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          color: 'var(--color-player-body)',
          marginBottom: '8px',
        }}
      >
        {t('ui.settings.title')}
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.5px',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        {t('ui.settings.changes')}
      </p>

      <label
        htmlFor={crtId}
        style={{
          display: 'block',
          minHeight: 'var(--touch-target-min)',
          marginBottom: 'var(--spacing-sm)',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 'var(--spacing-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--color-text-primary)',
            marginBottom: '4px',
          }}
        >
          <span>{t('ui.settings.crt')}</span>
          <span>{Math.round(crtIntensity * 100)}%</span>
        </span>
        <input
          id={crtId}
          type="range"
          autoFocus
          min="0"
          max="0.20"
          step="0.01"
          value={crtIntensity}
          aria-valuetext={`${Math.round(crtIntensity * 100)} percent`}
          onChange={(e) => onCrtChange(parseFloat(e.target.value))}
          style={{
            width: '100%',
            height: '24px',
            display: 'block',
            accentColor: 'var(--color-player-body)',
          }}
        />
      </label>

      <label
        htmlFor={darknessId}
        style={{
          display: 'block',
          minHeight: 'var(--touch-target-min)',
          marginBottom: 'var(--spacing-sm)',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 'var(--spacing-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--color-text-primary)',
            marginBottom: '4px',
          }}
        >
          <span>{t('ui.settings.darkness')}</span>
          <span>{Math.round(darknessDensity * 100)}%</span>
        </span>
        <input
          id={darknessId}
          type="range"
          min="0.25"
          max="0.80"
          step="0.05"
          value={darknessDensity}
          aria-valuetext={`${Math.round(darknessDensity * 100)} percent`}
          onChange={(e) => onDarknessChange(parseFloat(e.target.value))}
          style={{
            width: '100%',
            height: '24px',
            display: 'block',
            accentColor: 'var(--color-player-body)',
          }}
        />
      </label>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--spacing-md)',
          minHeight: 'var(--touch-target-min)',
          marginBottom: 'var(--spacing-md)',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            lineHeight: 1.4,
            color: 'var(--color-text-primary)',
          }}
        >
          {t('ui.settings.reduced_motion')}
        </span>
        <input
          type="checkbox"
          checked={reducedMotion}
          onChange={(e) => onReducedMotionChange(e.target.checked)}
          style={{
            width: '18px',
            height: '18px',
            flexShrink: 0,
            accentColor: 'var(--color-player-body)',
          }}
        />
      </label>

      <button
        type="button"
        onClick={onBack}
        style={{
          width: '100%',
          minHeight: 'var(--touch-target-min)',
          background: 'var(--color-player-body)',
          color: 'var(--color-text-inverse)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: 700,
          borderRadius: 'var(--radius-sm)',
        }}
      >
        {t('ui.settings.back')}
      </button>
    </div>
  );
};
