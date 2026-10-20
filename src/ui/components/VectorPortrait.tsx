import React from 'react';
import { EmotionState } from '../../game/content/schemas/character';
import { t } from '../../content/locales/en';

interface VectorPortraitProps {
  emotion: EmotionState;
  size?: number;
}

export const VectorPortrait: React.FC<VectorPortraitProps> = ({
  emotion,
  size = 280,
}) => {
  // Glow token based on emotion state
  const glowVar =
    emotion === 'worried'
      ? 'var(--color-danger-amber)'
      : emotion === 'relieved'
      ? 'var(--color-seed-core)'
      : 'var(--color-player-body)';

  const stateKey = `state.${emotion}` as const;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 40%, var(--color-ground-elevated) 0%, var(--color-ground-base) 85%)',
        border: `1.5px solid ${glowVar}`,
        boxShadow: `0 0 25px ${glowVar}`,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Tactical Grid Background */}
      <svg
        style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }}
        width="100%"
        height="100%"
      >
        <pattern id="tactical-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--color-player-body)" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#tactical-grid)" />
      </svg>

      {/* Layered In-Code Vector Art using Theme Tokens */}
      <svg
        viewBox="0 0 200 200"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <linearGradient id="jacketGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-portrait-jacket-mid)" />
            <stop offset="100%" stopColor="var(--color-portrait-jacket-dark)" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-portrait-skin-base)" />
            <stop offset="100%" stopColor="var(--color-portrait-skin-shadow)" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-portrait-hair-base)" />
            <stop offset="100%" stopColor="var(--color-portrait-hair-shadow)" />
          </linearGradient>
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={glowVar} stopOpacity="1" />
            <stop offset="100%" stopColor={glowVar} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Shoulders & High-Collar Field Jacket */}
        <path
          d="M 30 200 L 45 155 Q 60 145 100 145 Q 140 145 155 155 L 170 200 Z"
          fill="url(#jacketGrad)"
          stroke="var(--color-portrait-jacket-border)"
          strokeWidth="1.2"
        />

        {/* Jacket Collar Flaps */}
        <path d="M 68 152 L 80 135 L 100 145 L 75 160 Z" fill="var(--color-portrait-jacket-light)" />
        <path d="M 132 152 L 120 135 L 100 145 L 125 160 Z" fill="var(--color-portrait-jacket-light)" />

        {/* Glowing Beacon Collar Pin Badge */}
        <circle cx="100" cy="148" r="6" fill={glowVar} />
        <circle cx="100" cy="148" r="14" fill="url(#lampGlow)" opacity="0.6" />
        <circle cx="100" cy="148" r="3" fill="var(--color-portrait-eye-highlight)" />

        {/* Neck */}
        <path d="M 86 115 L 86 142 L 114 142 L 114 115 Z" fill="var(--color-portrait-skin-shadow)" />

        {/* Face Base */}
        <path
          d="M 72 82 Q 68 112 100 128 Q 132 112 128 82 Q 130 52 100 52 Q 70 52 72 82 Z"
          fill="url(#skinGrad)"
        />

        {/* Hair - Back Layer */}
        <path
          d="M 60 75 Q 52 105 68 128 Q 50 110 52 80 Q 56 42 100 38 Q 144 42 148 80 Q 150 110 132 128 Q 148 105 140 75 Z"
          fill="url(#hairGrad)"
        />

        {/* Nose Line */}
        <path
          d="M 100 86 L 97 99 L 103 99"
          fill="none"
          stroke="var(--color-portrait-skin-deep)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Facial Expression States (Neutral, Worried, Relieved) */}
        {emotion === 'worried' ? (
          <g id="worried-expression">
            {/* Drawn inner brows */}
            <path d="M 80 77 Q 88 80 94 75" fill="none" stroke="var(--color-portrait-feature-dark)" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 120 77 Q 112 80 106 75" fill="none" stroke="var(--color-portrait-feature-dark)" strokeWidth="2.2" strokeLinecap="round" />
            {/* Wide tense eyes */}
            <ellipse cx="87" cy="84" rx="4.5" ry="3.2" fill="var(--color-portrait-eye-iris)" />
            <circle cx="88" cy="83" r="1.2" fill="var(--color-portrait-eye-highlight)" />
            <ellipse cx="113" cy="84" rx="4.5" ry="3.2" fill="var(--color-portrait-eye-iris)" />
            <circle cx="114" cy="83" r="1.2" fill="var(--color-portrait-eye-highlight)" />
            {/* Pressed tense mouth */}
            <path d="M 94 113 Q 100 111 106 113" fill="none" stroke="var(--color-portrait-feature-lip)" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        ) : emotion === 'relieved' ? (
          <g id="relieved-expression">
            {/* Relaxed curved brows */}
            <path d="M 80 75 Q 87 72 94 76" fill="none" stroke="var(--color-portrait-feature-dark)" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 120 75 Q 113 72 106 76" fill="none" stroke="var(--color-portrait-feature-dark)" strokeWidth="2.2" strokeLinecap="round" />
            {/* Calm soft eyes */}
            <ellipse cx="87" cy="84" rx="4.5" ry="2.6" fill="var(--color-portrait-eye-iris)" />
            <circle cx="88.5" cy="83" r="1.4" fill="var(--color-portrait-eye-highlight)" />
            <ellipse cx="113" cy="84" rx="4.5" ry="2.6" fill="var(--color-portrait-eye-iris)" />
            <circle cx="114.5" cy="83" r="1.4" fill="var(--color-portrait-eye-highlight)" />
            {/* Subtle warm smile */}
            <path d="M 93 111 Q 100 117 107 111" fill="none" stroke="var(--color-portrait-feature-lip)" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        ) : (
          <g id="neutral-expression">
            {/* Level focused brows */}
            <path d="M 80 75 L 94 75" fill="none" stroke="var(--color-portrait-feature-dark)" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 120 75 L 106 75" fill="none" stroke="var(--color-portrait-feature-dark)" strokeWidth="2.2" strokeLinecap="round" />
            {/* Level steady gaze */}
            <ellipse cx="87" cy="84" rx="4.2" ry="2.8" fill="var(--color-portrait-eye-iris)" />
            <circle cx="88" cy="83" r="1.3" fill="var(--color-portrait-eye-highlight)" />
            <ellipse cx="113" cy="84" rx="4.2" ry="2.8" fill="var(--color-portrait-eye-iris)" />
            <circle cx="114" cy="83" r="1.3" fill="var(--color-portrait-eye-highlight)" />
            {/* Straight neutral mouth */}
            <line x1="94" y1="112" x2="106" y2="112" stroke="var(--color-portrait-feature-lip)" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        )}

        {/* Hair - Windswept Front Bangs */}
        <path
          d="M 64 68 Q 80 40 115 44 Q 138 48 142 70 Q 120 54 90 62 Q 74 66 64 68 Z"
          fill="url(#hairGrad)"
        />
        <path
          d="M 64 68 Q 62 86 68 102 Q 72 82 78 72 Z"
          fill="var(--color-portrait-hair-shadow)"
        />

        {/* Reticle Corner Brackets */}
        <path d="M 12 25 L 12 12 L 25 12" fill="none" stroke={glowVar} strokeWidth="1.5" />
        <path d="M 188 25 L 188 12 L 175 12" fill="none" stroke={glowVar} strokeWidth="1.5" />
        <path d="M 12 175 L 12 188 L 25 188" fill="none" stroke={glowVar} strokeWidth="1.5" />
        <path d="M 188 175 L 188 188 L 175 188" fill="none" stroke={glowVar} strokeWidth="1.5" />
      </svg>

      {/* Status Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 'var(--spacing-sm)',
          left: 'var(--spacing-sm)',
          right: 'var(--spacing-sm)',
          padding: '4px 8px',
          background: 'var(--color-surface-overlay)',
          backdropFilter: 'blur(4px)',
          border: '1px solid var(--color-panel-border)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: glowVar,
        }}
      >
        <span>
          {t('ui.radio.state_label')}: {t(stateKey)}
        </span>
        <span>
          {t('ui.radio.signal_label')}: {t('ui.dossier.sig_freq')}
        </span>
      </div>
    </div>
  );
};
