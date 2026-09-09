'use client'

// Tiny client-side handoff for the active scene between /analyze and /viewer.
// Blob URLs created during upload stay valid for the tab's lifetime, so we keep
// them in a module singleton (survives client-side navigation) with a
// sessionStorage mirror as a fallback across the same tab.

export interface SceneInput {
  textureUrl: string
  fileName: string
  width: number
  height: number
  demo: boolean
}

export const DEFAULT_SCENE: SceneInput = {
  textureUrl: '/textures/satellite.png',
  fileName: 'rgb_2021.tif',
  width: 1024,
  height: 1024,
  demo: true,
}

const KEY = 'dw:scene'
let current: SceneInput | null = null

export function setScene(scene: SceneInput) {
  current = scene
  try {
    sessionStorage.setItem(KEY, JSON.stringify(scene))
  } catch {
    // sessionStorage may be unavailable; module singleton still works.
  }
}

export function getScene(): SceneInput {
  if (current) return current
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw) {
      current = JSON.parse(raw) as SceneInput
      return current
    }
  } catch {
    // ignore
  }
  return DEFAULT_SCENE
}
