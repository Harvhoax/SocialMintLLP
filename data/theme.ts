// Palette A: shared by the document, CSS, canvas backgrounds and WebGL details.
// Keep the palette in one place so a later comparison can use the same layout.
export const siteTheme = {
  id: 'mint-coral',
  background: '#07100C',
  surface: '#111B16',
  elevated: '#1B2820',
  brand: '#9AEFB2',
  accent: '#FF8F7A',
  accentSoft: '#FFC9AE',
  accentDeep: '#FF8F7A',
  text: '#F2F1EA',
  muted: '#9BADA1',
};

export function rgb(hex: string): number[] {
  return [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16));
}

export function blend(from: string, to: string, amount: number): number[] {
  const destination = rgb(to);
  return rgb(from).map((value, i) => Math.round(value + (destination[i] - value) * amount));
}

export const themeVariables = {
  '--bg': siteTheme.background,
  '--panel': siteTheme.surface,
  '--elevated': siteTheme.elevated,
  '--mint': siteTheme.brand,
  '--accent': siteTheme.accent,
  '--accent-soft': siteTheme.accentSoft,
  '--accent-deep': siteTheme.accentDeep,
  '--cream': siteTheme.accentSoft,
  '--text': siteTheme.text,
  '--dim': siteTheme.muted,
  '--line': `rgba(${rgb(siteTheme.brand).join(',')},0.12)`,
  '--brand-rgb': rgb(siteTheme.brand).join(','),
  '--accent-rgb': rgb(siteTheme.accent).join(','),
  '--accent-deep-rgb': rgb(siteTheme.accentDeep).join(','),
  '--bg-rgb': rgb(siteTheme.background).join(','),
};
