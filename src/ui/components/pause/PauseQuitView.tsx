import React from 'react';
import { t } from '../../../content/locales/en';

interface PauseQuitViewProps {
  titleId: string;
  onCancel: () => void;
  onConfirmQuit: () => void;
}

export const PauseQuitView: React.FC<PauseQuitViewProps> = ({
  titleId,
  onCancel,
  onConfirmQuit,
}) => {
  return (
    <div>
      <h2
        id={titleId}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          color: 'var(--color-danger-ring)',
          marginBottom: '8px',
        }}
      >
        {t('ui.pause.quit_title')}
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
          marginBottom: '20px',
          lineHeight: 1.5,
        }}
      >
        {t('ui.pause.quit_body')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        <button
          type="button"
          autoFocus
          onClick={onCancel}
          style={{
            minHeight: 'var(--touch-target-min)',
            background: 'var(--color-player-body)',
            color: 'var(--color-text-inverse)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 800,
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {t('ui.pause.cancel_resume')}
        </button>
        <button
          type="button"
          onClick={onConfirmQuit}
          style={{
            minHeight: 'var(--touch-target-min)',
            background: 'transparent',
            border: '1px solid var(--color-danger-ring)',
            color: 'var(--color-danger-ring)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {t('ui.pause.confirm_quit')}
        </button>
      </div>
    </div>
  );
};
