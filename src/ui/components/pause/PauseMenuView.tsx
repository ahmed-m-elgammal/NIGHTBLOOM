import React from 'react';
import { t } from '../../../content/locales/en';

interface PauseMenuViewProps {
  titleId: string;
  onResume: () => void;
  onOpenSettings: () => void;
  onOpenQuit: () => void;
}

export const PauseMenuView: React.FC<PauseMenuViewProps> = ({
  titleId,
  onResume,
  onOpenSettings,
  onOpenQuit,
}) => {
  return (
    <div>
      <h2
        id={titleId}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          color: 'var(--color-player-body)',
          marginBottom: 'var(--spacing-xs)',
        }}
      >
        {t('ui.hud.paused_title')}
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        {t('ui.hud.paused_body')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        <button
          type="button"
          autoFocus
          onClick={onResume}
          style={{
            minHeight: 'var(--touch-target-min)',
            background: 'var(--color-player-body)',
            color: 'var(--color-text-inverse)',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            fontWeight: 800,
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {t('ui.hud.btn_resume')}
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          style={{
            minHeight: 'var(--touch-target-min)',
            background: 'var(--color-surface-card)',
            border: '1px solid var(--color-panel-border)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {t('ui.pause.settings')}
        </button>
        <button
          type="button"
          onClick={onOpenQuit}
          style={{
            minHeight: 'var(--touch-target-min)',
            background: 'var(--color-surface-card)',
            border: '1px solid var(--color-panel-border-subtle)',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            borderRadius: 'var(--radius-sm)',
            marginTop: '8px',
          }}
        >
          {t('ui.hud.btn_return')}
        </button>
      </div>
    </div>
  );
};
