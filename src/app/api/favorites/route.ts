import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ data: [] })
}

export async function POST(request: Request) {
  try {
    const { propertyId } = await request.json()
    return NextResponse.json({ success: true, propertyId })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { propertyId } = await request.json()
    return NextResponse.json({ success: true, propertyId })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
