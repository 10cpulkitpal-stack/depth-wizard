import { NextResponse } from 'next/server'

// POST /api/analyze — enqueue a terrain analysis job.
// Mock implementation: returns a job id the client can poll.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  return NextResponse.json({
    id: 'job_8f21c4',
    status: 'processing',
    step: 0,
    received: {
      filename: body?.filename ?? 'rgb_2021.tif',
      quality: body?.quality ?? 'quality',
    },
  })
}
