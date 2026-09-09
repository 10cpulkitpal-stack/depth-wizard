// Thin API client. Keeps network shape isolated from UI components so a real
// backend can be dropped in later without touching the pages.

import { SCENE, ARTIFACTS, type InferenceQuality, type SceneMeta, type Artifact } from './depthwizard'

export interface AnalyzeRequest {
  filename: string
  quality: InferenceQuality
  acquisitionTime?: string
  hasReferenceDem?: boolean
  hasGroundTruth?: boolean
}

export interface Job {
  id: string
  status: 'queued' | 'processing' | 'complete'
  step: number
}

export interface JobResult {
  meta: SceneMeta
  artifacts: Artifact[]
}

// In a real deployment these hit /api/*. For the demo we resolve locally so the
// frontend is fully functional without a backend.
export async function startAnalysis(_req: AnalyzeRequest): Promise<Job> {
  return { id: 'job_8f21c4', status: 'processing', step: 0 }
}

export async function getJob(id: string): Promise<Job> {
  return { id, status: 'processing', step: 0 }
}

export async function getResult(_id: string): Promise<JobResult> {
  return { meta: SCENE, artifacts: ARTIFACTS }
}

export function artifactUrl(id: string, name: string): string {
  return `/api/jobs/${id}/artifacts/${name}`
}
