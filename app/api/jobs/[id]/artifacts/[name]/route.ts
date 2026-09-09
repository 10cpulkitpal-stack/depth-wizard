import { NextResponse } from 'next/server'

// GET /api/jobs/:id/artifacts/:name — artifact download.
// Mock: returns a small text stand-in so the download flow works end-to-end.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; name: string }> },
) {
  const { id, name } = await params
  const body = `DepthWizard artifact placeholder\njob: ${id}\nartifact: ${name}\n`
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="${name}.txt"`,
    },
  })
}
