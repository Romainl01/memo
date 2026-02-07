/**
 * Warm monochrome aurora palette for onboarding.
 * Three orbs in coral → peach → apricot, no clashing greens.
 */

export interface AuroraPalette {
  orb1: string;
  orb2: string;
  orb3: string;
}

export const lightAurora: AuroraPalette = {
  orb1: '#F28C59', // Coral (matches brand primary)
  orb2: '#FFCAB0', // Peach
  orb3: '#FFD4B8', // Apricot
};

export const darkAurora: AuroraPalette = {
  orb1: '#A3562F', // Deep terracotta
  orb2: '#8B6B50', // Muted bronze
  orb3: '#6B4A3A', // Dark apricot
};
