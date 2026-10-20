/**
 * NIGHTBLOOM: The Last Signal — Theme Tokens
 * Authority: spec/UX Specification and UI Design System.md §5
 * Shared semantic tokens for Canvas rendering, SVG vector routines, and DOM styling.
 * Strict Rule: ZERO hardcoded hex codes or arbitrary rgba values in component/canvas logic.
 */

export const ThemeTokens = {
  colors: {
    // Ground & Flora (Deep blue-green ambient palette)
    groundBase: '#050f16',
    groundSecondary: '#081a26',
    groundElevated: '#0c2536',
    floraPatch: '#0d3830',
    waterMargin: '#06202e',

    // Friendly Signal & Player (Cyan accents)
    playerBody: '#22d3ee',
    playerLamp: '#67e8f9',
    flareTrail: '#38bdf8',
    signalCyanDim: '#0891b2',
    signalCyanGlow: 'rgba(34, 211, 238, 0.35)',
    signalCyanGhost: 'rgba(34, 211, 238, 0.12)',
    signalCyanTransparent: 'rgba(34, 211, 238, 0)',

    // Hostile Entities & Danger (Amber / Red accents)
    hostileCore: '#f59e0b',
    dangerAmberBright: '#fbbf24',
    dangerAmberGlow: 'rgba(245, 158, 11, 0.35)',
    dangerAmberGhost: 'rgba(245, 158, 11, 0.12)',
    dangerAmberTransparent: 'rgba(245, 158, 11, 0)',
    dangerRing: '#f43f5e',
    dangerRedGhost: 'rgba(244, 63, 94, 0.15)',

    // Flora & XP (Mint green accents)
    seedCore: '#10b981',
    seedHalo: '#34d399',
    seedHaloGlow: 'rgba(16, 185, 129, 0.35)',
    seedGhost: 'rgba(16, 185, 129, 0.12)',
    seedTransparent: 'rgba(16, 185, 129, 0)',

    // Health gauge
    healthGaugeFill: '#f43f5e',
    healthGaugeTrack: 'rgba(244, 63, 94, 0.2)',

    // Shadows
    shadowEntity: 'rgba(0, 0, 0, 0.45)',
    shadowBackdrop: 'rgba(0, 0, 0, 0.85)',

    // Surface Panels & Overlays
    surfaceOverlay: 'rgba(8, 24, 36, 0.92)',
    surfaceCard: 'rgba(12, 33, 49, 0.78)',
    surfaceCardHover: 'rgba(16, 44, 66, 0.88)',
    surfaceCardActive: 'rgba(20, 54, 82, 0.95)',
    panelBorder: 'rgba(34, 211, 238, 0.24)',
    panelBorderSubtle: 'rgba(148, 163, 184, 0.18)',
    panelBorderHover: 'rgba(34, 211, 238, 0.55)',
    panelBorderActive: 'rgba(34, 211, 238, 0.9)',

    // Vector Portrait Layer Palette
    portraitJacketDark: '#081820',
    portraitJacketMid: '#102e3b',
    portraitJacketLight: '#143c4d',
    portraitJacketBorder: 'rgba(34, 211, 238, 0.4)',
    portraitSkinBase: '#d8a684',
    portraitSkinShadow: '#b47854',
    portraitSkinDeep: '#8e5535',
    portraitHairBase: '#4a403d',
    portraitHairShadow: '#2b2320',
    portraitHairHighlight: '#635652',
    portraitFeatureDark: '#251c19',
    portraitFeatureLip: '#7c3725',
    portraitEyeIris: '#111827',
    portraitEyeHighlight: '#ffffff',

    // Soil, Agricultural Furrows & Concrete
    soilFurrowDark: '#040b10',
    soilFurrowLight: '#091e2b',
    mossDense: '#0a3528',
    mossFringe: '#124838',
    concreteBase: '#1a2936',
    concreteRim: '#2d3f4e',
    concreteCrack: '#0e1821',

    // Industrial & Rust
    hazardYellow: '#eab308',
    hazardStripe: '#050f16',
    rustPlateDark: '#3b1d11',
    rustPlateMid: '#6e341b',
    rustPlateLight: '#9a4c28',
    cableBlack: '#03080e',
    metalTrim: '#334155',
    metalRivets: '#64748b',
    beaconCoilCopper: '#c2410c',
    beaconCoilGlow: 'rgba(56, 189, 248, 0.6)',
    glassCabin: 'rgba(34, 211, 238, 0.25)',
    glassFrame: '#17303f',

    // Ambient Lighting & Vignette
    vignetteShadow: 'rgba(3, 7, 12, 0.72)',
    vignetteSoft: 'rgba(3, 7, 12, 0.28)',
    ambientDarkness: 'rgba(5, 15, 22, 0.35)',
    backdropDeep: '#0a2130',
    scanlineBand: 'rgba(0, 0, 0, 0.25)',
    transparent: 'rgba(0, 0, 0, 0)',

    // Dynamic Lighting Gradients
    lanternBeamBroad: 'rgba(34, 211, 238, 0.22)',
    lanternBeamFaint: 'rgba(34, 211, 238, 0.08)',
    lanternBeamCore: 'rgba(103, 232, 249, 0.25)',
    lanternBeamCoreFade: 'rgba(34, 211, 238, 0.06)',
    lanternBeamFoot: 'rgba(34, 211, 238, 0.14)',
    beaconGlowInner: 'rgba(34, 211, 238, 0.22)',
    beaconGlowOuter: 'rgba(34, 211, 238, 0.06)',

    // Low-HP / Feedback Pulses
    dangerEdgePulseLow: 'rgba(244, 63, 94, 0.25)',
    dangerEdgePulseHigh: 'rgba(244, 63, 94, 0.55)',
    abilityActivePress: 'rgba(34, 211, 238, 0.25)',

    // Typography (High-contrast accessible text)
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1', // Brightened for >= 4.5:1 contrast against dark cards
    textSecondaryBright: '#e2e8f0',
    textMuted: '#94a3b8',
    textInverse: '#050f16',
  },

  typography: {
    fontDisplay: "'Outfit', 'Space Grotesk', -apple-system, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    fontBody: "'Outfit', sans-serif",
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    touchTargetMin: '48px', // WCAG 2.5.5 / 2.5.8 compliant
  },

  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },

  shadows: {
    panel: '0 8px 32px 0 rgba(0, 0, 0, 0.56)',
    glowCyan: '0 0 20px rgba(34, 211, 238, 0.35)',
    glowAmber: '0 0 20px rgba(245, 158, 11, 0.35)',
    glowMint: '0 0 20px rgba(16, 185, 129, 0.35)',
  },
} as const;

export type ThemeTokensType = typeof ThemeTokens;
