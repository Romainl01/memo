/**
 * Color tokens from Figma design system
 * @see https://www.figma.com/design/SUKow1jcAFeIcHODQcEy8n/Pia
 */

export const colors = {
  // Primary
  primary: '#F28C59',
  primary200: '#C9A961',
  primaryLight: '#FDEBE3',
  primaryGradientStart: '#FFCAB0',

  // Neutral
  neutralDark: '#262629',
  neutralWhite: '#FFFFFF',
  neutralGray: '#6A7282',
  neutralGray200: '#D9DBE1',
  neutralGray300: '#8A898E',

  // Surface
  surfaceLight: '#F9F9F5',
  surfaceCard: 'rgba(255, 255, 255, 0.5)',

  // Feedback
  feedbackSuccess: '#0E9F6E',
  feedbackError: '#E5484D',

  // Toast
  toastFuseBorder: '#7DD3C0',
} as const;

export type ColorToken = keyof typeof colors;

/**
 * Journal dot grid color schemes
 * Each scheme provides distinct colors for all 4 dot states:
 * - filled: Days with entries (bold, saturated)
 * - pastEmpty: Past days without entries (lighter for contrast)
 * - future: Future days (subtle, barely visible)
 * - todayRing: Ring around today's dot (contrasting accent)
 */
export const journalColorSchemes = {
  /** Terra - Rich, earthy, Mediterranean feel */
  A: {
    filled: '#B84422',      // Deep Terracotta (more saturated)
    pastEmpty: '#C9BDB0',   // Warm Clay (lighter for contrast)
    future: '#E8E2D9',      // Soft Sand
    todayRing: '#5B8A60',   // Sage Green (more saturated)
  },
  /** Ocean - Coastal, warm sunset vibes */
  B: {
    filled: '#1A6B6B',      // Deep Teal (more saturated)
    pastEmpty: '#D8CBAF',   // Warm Sand (lighter for contrast)
    future: '#EAE4D8',      // Pale Dune
    todayRing: '#CC8020',   // Amber Gold (richer)
  },
  /** Forest - Deep, rich, autumnal */
  C: {
    filled: '#2D5A3F',      // Forest Green (deeper)
    pastEmpty: '#C5BAA8',   // Warm Stone (lighter for contrast)
    future: '#E5E2D8',      // Pale Moss
    todayRing: '#A86525',   // Burnished Copper (deeper)
  },
} as const;

export type JournalColorScheme = keyof typeof journalColorSchemes;
