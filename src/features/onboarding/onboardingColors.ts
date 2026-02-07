/**
 * Multi-hue aurora palette for onboarding.
 * Four orbs with distinct hue families create a watercolor aurora
 * effect when blur merges their edges.
 */

export interface AuroraPalette {
  orb1: string;
  orb2: string;
  orb3: string;
  orb4: string;
  gradientStart: string;
  gradientEnd: string;
}

export const lightAurora: AuroraPalette = {
  orb1: '#F28C59', // Coral — brand anchor
  orb2: '#E8889B', // Dusty rose — warm blush
  orb3: '#F5D08A', // Golden cream — sunny warmth
  orb4: '#C4A8D4', // Muted lavender — aurora depth
  gradientStart: '#FFF5EC', // Near-white warm canvas
  gradientEnd: '#F9F9F5',
};

export const darkAurora: AuroraPalette = {
  orb1: '#B85C30', // Deep coral
  orb2: '#A05568', // Dark rose
  orb3: '#B89450', // Dark gold
  orb4: '#7B6890', // Dark lavender
  gradientStart: '#352520', // Subtle warm dark
  gradientEnd: '#1A1918',
};
