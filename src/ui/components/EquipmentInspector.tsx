/**
 * Tactical Equipment & Armament Blueprint Inspector
 * Authority: spec/UX Specification and UI Design System.md §3 & CHARACTERS.md §1
 * Interactive technical schematics and field loadout diagnostics for Mira Vale.
 */

import React, { useState } from 'react';
import { AudioService } from '../../services/audio';

interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  designation: string;
  specs: { label: string; value: string }[];
  status: string;
  integrityPercent: number;
  description: string;
  lore: string;
  svgIcon: React.ReactNode;
}

export const EquipmentInspector: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('lamp');

  const items: EquipmentItem[] = [
    {
      id: 'lamp',
      name: 'Halogen Signal Lamp Mk IV',
      category: 'PRIMARY OPTICS',
      designation: 'MOD-L44-HALO',
      specs: [
        { label: 'BEAM RANGE', value: '140 METERS' },
        { label: 'COLOR TEMP', value: '3200K HALOGEN' },
        { label: 'POWER CELL', value: 'LITHIUM-NICKEL PACK' },
        { label: 'APERTURE', value: 'FEATHERED WEDGE (52°)' },
      ],
      status: 'OPERATIONAL // ACTIVE CALIBRATION',
      integrityPercent: 94,
      description: 'Heavy shoulder-mounted searchlight with parabolic focusing lens and shock-mounted halogen filament.',
      lore: 'Standard issue to Tenth Column scouts. The only tool that cuts through spore-dampened twilight fog.',
      svgIcon: (
        <svg viewBox="0 0 48 48" style={{ width: '32px', height: '32px' }}>
          <rect x="8" y="14" width="16" height="20" rx="3" fill="none" stroke="var(--color-player-body)" strokeWidth="2" />
          <path d="M 24 18 L 38 10 L 38 38 L 24 30 Z" fill="var(--color-signal-cyan-ghost)" stroke="var(--color-player-lamp)" strokeWidth="2" />
          <circle cx="16" cy="24" r="4" fill="var(--color-player-lamp)" />
          <line x1="28" y1="24" x2="44" y2="24" stroke="var(--color-player-lamp)" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      ),
    },
    {
      id: 'resonator',
      name: '104.2 MHz Resonator Pack',
      category: 'TACTICAL EMITTER',
      designation: 'COIL-RES-104',
      specs: [
        { label: 'FREQUENCY', value: '104.200 MHz' },
        { label: 'PULSE RADIUS', value: '180 PX BLAST' },
        { label: 'CYCLE RATE', value: '3.50 SEC RECHARGE' },
        { label: 'CAPACITANCE', value: '440 uF COPPER CHOKE' },
      ],
      status: 'SYNCHRONIZED // BEACON LINK ESTABLISHED',
      integrityPercent: 88,
      description: 'Harmonic dampening transceiver coil strapped to Mira\'s harness. Generates radial kinetic repulsion waves.',
      lore: 'Allows the signal keeper to clear approaching spores when the Nursery Beacon is under heavy siege.',
      svgIcon: (
        <svg viewBox="0 0 48 48" style={{ width: '32px', height: '32px' }}>
          <circle cx="24" cy="24" r="8" fill="none" stroke="var(--color-player-body)" strokeWidth="2" />
          <circle cx="24" cy="24" r="14" fill="none" stroke="var(--color-player-lamp)" strokeWidth="1.5" strokeDasharray="4 2" />
          <circle cx="24" cy="24" r="20" fill="none" stroke="var(--color-seed-core)" strokeWidth="1" strokeDasharray="2 4" />
          <circle cx="24" cy="24" r="3" fill="var(--color-player-body)" />
        </svg>
      ),
    },
    {
      id: 'coat',
      name: 'Faraday Field Trenchcoat',
      category: 'SURVIVAL WEAR',
      designation: 'SPEC-GEAR-COAT',
      specs: [
        { label: 'MATERIAL', value: 'WAXED COTTON / COPPER' },
        { label: 'ENVIRONMENT', value: 'ACID SPORE RATED' },
        { label: 'INSULATION', value: 'THERMAL FLANNEL CORE' },
        { label: 'STORAGE', value: '4 CARTRIDGE POUCHES' },
      ],
      status: 'WEATHERED // SLIGHT SCUFFING',
      integrityPercent: 78,
      description: 'Full-length operative coat woven with fine copper shielding wire to resist electromagnetic anomalies.',
      lore: 'The deep teal fabric blends into nursery peat while the cyan collar rim provides vital friendly identification.',
      svgIcon: (
        <svg viewBox="0 0 48 48" style={{ width: '32px', height: '32px' }}>
          <path d="M 12 12 L 20 8 L 24 14 L 28 8 L 36 12 L 40 40 L 8 40 Z" fill="none" stroke="var(--color-player-body)" strokeWidth="2" />
          <line x1="24" y1="14" x2="24" y2="40" stroke="var(--color-panel-border)" strokeWidth="1.5" />
          <circle cx="24" cy="18" r="2" fill="var(--color-amber-muted)" />
          <circle cx="24" cy="24" r="2" fill="var(--color-amber-muted)" />
        </svg>
      ),
    },
    {
      id: 'scythe',
      name: 'Pneumatic Spore Scythe',
      category: 'FIELD TOOL',
      designation: 'AGRI-TOOL-09',
      specs: [
        { label: 'BLADE SPEED', value: '4,200 STROKES/MIN' },
        { label: 'DRIVE TYPE', value: 'PNEUMATIC CANISTER' },
        { label: 'EDGE ALLOY', value: 'TUNGSTEN-CARBIDE' },
        { label: 'WEIGHT', value: '3.8 KG' },
      ],
      status: 'STANDBY // SHARPENED',
      integrityPercent: 92,
      description: 'Industrial hedge and cane cutter repurposed for clearing dense mutated Stormroot brambles.',
      lore: 'Nursery workers called it the "Weed Surgeon". Now it keeps predatory tendrils from severing the beacon cables.',
      svgIcon: (
        <svg viewBox="0 0 48 48" style={{ width: '32px', height: '32px' }}>
          <line x1="8" y1="40" x2="36" y2="12" stroke="var(--color-player-body)" strokeWidth="2.5" />
          <path d="M 36 12 Q 44 4 42 18 Q 38 24 30 20 Z" fill="var(--color-signal-cyan-ghost)" stroke="var(--color-player-lamp)" strokeWidth="2" />
          <rect x="10" y="34" width="8" height="4" rx="1" fill="var(--color-amber-muted)" />
        </svg>
      ),
    },
  ];

  const current = items.find((i) => i.id === selectedId) || items[0];

  const handleSelect = (id: string) => {
    AudioService.playBlip();
    setSelectedId(id);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: 'var(--spacing-md)',
        background: 'var(--color-surface-card)',
        border: '1px solid var(--color-panel-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-md)',
      }}
    >
      {/* Left Item Selector Roster */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', letterSpacing: '1px' }}>
          FIELD LOADOUT // SURVIVAL GEAR
        </div>
        {items.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                minHeight: 'var(--touch-target-min)',
                borderRadius: 'var(--radius-sm)',
                background: isSelected ? 'var(--color-surface-card-active)' : 'var(--color-surface-overlay)',
                border: isSelected ? '1px solid var(--color-player-body)' : '1px solid var(--color-panel-border-subtle)',
                boxShadow: isSelected ? 'var(--shadow-glow-cyan)' : 'none',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ flexShrink: 0 }}>{item.svgIcon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: isSelected ? 'var(--color-player-body)' : 'var(--color-text-muted)' }}>
                  {item.category}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {item.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right Item Blueprint Diagnostic Display */}
      <div
        style={{
          background: 'var(--color-surface-overlay)',
          border: '1px solid var(--color-panel-border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--spacing-md)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Blueprint Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-panel-border-subtle)', paddingBottom: '8px', marginBottom: '12px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-player-body)', letterSpacing: '1px' }}>
                {current.designation} // {current.category}
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)', margin: '2px 0 0 0' }}>
                {current.name}
              </h2>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              <div style={{ color: 'var(--color-seed-core)', fontWeight: 700 }}>{current.status}</div>
              <div style={{ color: 'var(--color-text-muted)' }}>INTEGRITY: {current.integrityPercent}%</div>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
            {current.description}
          </p>

          {/* Technical Specifications Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px', background: 'var(--color-surface-card)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
            {current.specs.map((s, idx) => (
              <div key={idx} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{s.label}:</span>{' '}
                <strong style={{ color: 'var(--color-player-body)' }}>{s.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Narrative Lore Footnote */}
        <div style={{ borderTop: '1px solid var(--color-panel-border-subtle)', paddingTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          FIELD RECORD: "{current.lore}"
        </div>
      </div>
    </div>
  );
};
