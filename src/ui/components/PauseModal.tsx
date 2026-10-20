import React, { useEffect, useId, useRef, useState } from 'react';
import { AudioService } from '../../services/audio';
import { PauseMenuView } from './pause/PauseMenuView';
import { PauseSettingsView } from './pause/PauseSettingsView';
import { PauseQuitView } from './pause/PauseQuitView';

type PauseView = 'menu' | 'settings' | 'quit';

interface PauseModalProps {
  crtIntensity: number;
  reducedMotion: boolean;
  darknessDensity: number;
  onCrtChange: (val: number) => void;
  onReducedMotionChange: (val: boolean) => void;
  onDarknessChange: (val: number) => void;
  onResume: () => void;
  onConfirmQuit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  crtIntensity,
  reducedMotion,
  darknessDensity,
  onCrtChange,
  onReducedMotionChange,
  onDarknessChange,
  onResume,
  onConfirmQuit,
}) => {
  const [view, setView] = useState<PauseView>('menu');
  const modalRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();

        if (view === 'menu') {
          onResume();
          return;
        }

        setView('menu');
        AudioService.playBlip();
        return;
      }

      if (event.key !== 'Tab') return;

      const root = modalRef.current;
      if (!root) return;

      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) {
        event.preventDefault();
        root.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const isInside = root.contains(active);

      if (event.shiftKey) {
        if (!isInside || active === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (!isInside || active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, onResume]);

  const openSettings = () => {
    setView('settings');
    AudioService.playBlip();
  };

  const openQuit = () => {
    setView('quit');
    AudioService.playBlip();
  };

  const returnToMenu = () => {
    setView('menu');
    AudioService.playBlip();
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--color-shadow-backdrop)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{
          background: 'var(--color-surface-overlay)',
          border: '1.5px solid var(--color-player-body)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-xl)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-glow-cyan)',
          width: 'calc(100% - 64px)',
          maxWidth: '440px',
        }}
      >
        {view === 'menu' && (
          <PauseMenuView
            titleId={titleId}
            onResume={onResume}
            onOpenSettings={openSettings}
            onOpenQuit={openQuit}
          />
        )}

        {view === 'settings' && (
          <PauseSettingsView
            titleId={titleId}
            crtIntensity={crtIntensity}
            reducedMotion={reducedMotion}
            darknessDensity={darknessDensity}
            onCrtChange={onCrtChange}
            onReducedMotionChange={onReducedMotionChange}
            onDarknessChange={onDarknessChange}
            onBack={returnToMenu}
          />
        )}

        {view === 'quit' && (
          <PauseQuitView
            titleId={titleId}
            onCancel={returnToMenu}
            onConfirmQuit={onConfirmQuit}
          />
        )}
      </div>
    </div>
  );
};
