import { NextResponse } from 'next/server'

// GET /api/jobs/:id — job status. Mock returns a completed job.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  return NextResponse.json({ id, status: 'complete', step: 6 })
}
