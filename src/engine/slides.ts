import { ComponentType } from 'react'
import { SlideContext, SlideMeta, SlideModule } from './types'

// Auto-découverte : chaque .tsx de src/slides/ exportant `meta` + `Component`
// devient une slide — rien à enregistrer. L'`id` vient du nom de fichier et
// l'ordre suit l'ordre alphabétique (préfixez par 01-, 02-, …).
// Les fichiers `_xxx.tsx` sont ignorés (helpers / partials partagés).
const modules = import.meta.glob('../slides/*.tsx', { eager: true }) as Record<
  string,
  { meta?: SlideMeta; Component?: ComponentType<SlideContext> }
>

const ORDER = [
  '01-titre',
  '01c-membres',
  '02-apercu',
  '03-seemslegit',
  '13-gestion-projet',
  '06-architecture',
  '07-agents',
  '07b-kratos',
  '08-aphrodite',
  '09-hephaestus',
  '10-c2-profiles',
  '11-code-generator',
  '12-virustotal',
  '13b-testers',
  '14-resultats',
  '14b-bilan',
  'a1-questions',
] as const

const orderIndex = new Map(ORDER.map((id, index) => [id, index]))

export const slides: SlideModule[] = Object.entries(modules)
  .filter(([path]) => !path.split('/').pop()!.startsWith('_'))
  .sort(([a], [b]) => {
    const aId = a.split('/').pop()!.replace(/\.tsx$/, '')
    const bId = b.split('/').pop()!.replace(/\.tsx$/, '')
    const ai = orderIndex.get(aId)
    const bi = orderIndex.get(bId)
    if (ai !== undefined && bi !== undefined) return ai - bi
    if (ai !== undefined) return -1
    if (bi !== undefined) return 1
    return a.localeCompare(b)
  })
  .map(([path, mod]) => ({
    id: path.split('/').pop()!.replace(/\.tsx$/, ''),
    meta: mod.meta ?? {},
    Component: mod.Component as ComponentType<SlideContext>,
  }))
