// ─────────────────────────────────────────────────────────────────────────
//  Le seul fichier à éditer pour personnaliser la présentation.
// ─────────────────────────────────────────────────────────────────────────

export const config = {
  brand: 'SeemsLegit · M1 Cybersécurité · Oteria 2025/2026',

  speakers: {
    Harouna: '#0f766e',
    Killian: '#1d4ed8',
    Jeremy: '#7c3aed',
  } as Record<string, string>,
}

// Palette de secours pour les orateurs sans couleur définie.
const FALLBACK = ['#1d4ed8', '#b91c1c', '#0f766e', '#7c3aed', '#b45309', '#0369a1']

export function speakerColor(name: string): string {
  const defined = config.speakers[name]
  if (defined) return defined
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return FALLBACK[h % FALLBACK.length]
}
