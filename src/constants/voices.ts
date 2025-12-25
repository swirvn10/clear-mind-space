export const AI_VOICES = [
  { id: 'sage', name: 'Sage', description: 'Calm & wise' },
  { id: 'alloy', name: 'Alloy', description: 'Neutral & clear' },
  { id: 'shimmer', name: 'Shimmer', description: 'Warm & gentle' },
  { id: 'echo', name: 'Echo', description: 'Soft & soothing' },
  { id: 'coral', name: 'Coral', description: 'Friendly & caring' },
  { id: 'ash', name: 'Ash', description: 'Direct & grounded' },
  { id: 'ballad', name: 'Ballad', description: 'Expressive & flowing' },
  { id: 'verse', name: 'Verse', description: 'Clear & articulate' },
] as const;

export type AIVoice = typeof AI_VOICES[number]['id'];
