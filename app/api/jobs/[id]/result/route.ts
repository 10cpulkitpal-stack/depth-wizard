import { NextResponse } from 'next/server'
import { SCENE, ARTIFACTS } from '@/lib/depthwizard'

// GET /api/jobs/:id/result — analysis result payload. Mock data for the demo.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  return NextResponse.json({ id, meta: SCENE, artifacts: ARTIFACTS })
}
